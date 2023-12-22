<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\{ User, Conversation, Message };
use App\Events\MessageEvent;
use Illuminate\Support\Facades\Redis;

class InboxController extends Controller
{
    public function redis()
    {
        return Redis::connection('conversations');
    }

    public function index(Request $request)
    {
        $query = Conversation::with(['participants.user', 'lastMessage']);
        $searchValues = preg_split('/\s+/', $request->q, -1, PREG_SPLIT_NO_EMPTY);
        $query->whereHas('participants', function($query) use ($request) {
            $query->where(['user_id' => $request->user()->id]);
        });
        $query->whereHas('participants.user', function($query) use ($searchValues) {
            foreach ($searchValues as $value) {
                $query->where('first_name', 'like', "%{$value}%");
                $query->orWhere('last_name', 'like', "%{$value}%");
            }
        });

        return Conversation::with(['participants.user', 'lastMessage'])->whereIn('id', $query->get()->pluck('id'))->whereNotIn('id', [])->orderBy('updated_at', 'DESC')->get();
    }

    public function create(Request $request)
    {
        $query = Conversation::with('participants.user');

        $query->whereHas('participants', function($query) use ($request) {
            $query->where(['user_id' => $request->user_id]);
        });

        $query->whereHas('participants', function($query) use ($request) {
            $query->where(['user_id' => $request->user()->id]);
        });

        if ($conversation = $query->first()) {

            if (! empty($request->message)) {

                $conversation->messages()->create([
                    'user_id' => $request->user()->id,
                    'message' => $request->message,
                ]);
            }

            return $conversation;
        }

        $conversation = Conversation::create([]);
        $conversation->participants()->create(['user_id' => $request->user_id]);
        $conversation->participants()->create(['user_id' => $request->user()->id]);

        if (! empty($request->message)) {
            $conversation->messages()->create([
                'user_id' => $request->user()->id,
                'message' => $request->message,
            ]);
        }

        return Conversation::with('participants.user')->find($conversation->id);
    }

    public function show($id, Request $request)
    {
        $conversation = Conversation::with(['participants.user'])->find($id);

        $this->redis()->del('conversations-'.$request->user()->id.'-'.$id);

        if ($request->messages === 'true') {
            return Message::with(['user'])->where(['conversation_id' => $id])->get();
        }

        return $conversation;
    }

    public function send($id, Request $request)
    {   
        $conversation = Conversation::with(['participants.user', 'messages.user'])->find($id);
        $message = $conversation->messages()->create([
            'user_id' => $request->user()->id,
            'message' => $request->message,
        ]);
        $conversation->touch();
        $conversation->participants()->touch();
        
        $otherParticipants = $conversation->participants()->where('user_id', '<>', $request->user()->id)->get();

        $this->redis()->del('conversations-'.$request->user()->id.'-'.$id);

        foreach ($otherParticipants as $participant) {
            $key = 'conversations-'.$participant->user_id.'-'.$conversation->id;
            $count = $this->redis()->exists($key) ? (int) $this->redis()->get($key) : 0;
            $this->redis()->set($key, $count + 1);
        }

        $message = Message::with(['user'])->find($message->id);

        broadcast(new MessageEvent($message))->toOthers();
        
        return $message;
    }

    public function unread(Request $request)
    {
        $keys = $this->redis()->keys('conversations-'.$request->user()->id.'-*');
        $count = 0;

        foreach ($keys as $key) {
            $count += (int) $this->redis()->get($key);
        }

        return $count;
    }
}