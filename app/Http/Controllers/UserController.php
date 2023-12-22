<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use App\Models\{ User };
use App\Services\Notification;
use App\Services\SemaphoreSms;

class UserController extends Controller
{
    public function index($roleId, Request $request) 
    {
        $data = User::withTrashed()->where(['role_id' => $roleId])->orderBy('id', 'DESC');

        if ($request->ajax() || ($request->has('search') && $request->search !== '')) {
            $searchValues = preg_split('/\s+/', $request->search, -1, PREG_SPLIT_NO_EMPTY);

            $data->where(function ($query) use ($searchValues) {
                foreach ($searchValues as $value) {
                    $query->where('first_name', 'like', "%{$value}%");
                    $query->orWhere('last_name', 'like', "%{$value}%");
                }
            });
        }

        return $data->paginate($request->per_page ?? 10);
    }

    public function show($id)
    {
        return User::withTrashed()->find($id);
    }

    public function create(StylistRequest $request)
    {
        $request->merge([
            'password' => Hash::make($request->password),
        ]);

        $user = User::create($request->except(['password_confirmation']));

        return response()->json([
            'message' => 'Created Successfully!',
            'success' => true,
        ], 200); 
    }

    public function update($id, Request $request)
    {
        User::withTrashed()->find($id)->update($request->all());

        return response()->json([
            'message' => 'Updated Successfully!',
            'success' => true,
        ], 200); 
    }

    public function delete(Request $request)
    {
        $data = User::withTrashed()->find($request->id);
        
          if ($data && $data->delete()) {
              return response()->json([
                  'message' => 'Deleted Successfully!',
                  'success' => true,
              ], 200);
          }

          return response()->json([
              'message' => 'Failed.',
              'success' => false,
          ], 200);
    }
}