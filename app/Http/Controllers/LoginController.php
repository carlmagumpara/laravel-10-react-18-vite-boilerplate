<?php

namespace App\Http\Controllers;

use Auth;
use DB;
use Session;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Requests\LoginRequest;
use App\Services\Authentication;
use Illuminate\Validation\ValidationException;
use Hash;

class LoginController extends Controller
{
    private $authentication;

    public function __construct(
        Authentication $authentication
    )
    {
        $this->authentication = $authentication;
    }

    public function index(LoginRequest $request)
    {
        $login = $request->email ?? $request->contact_no ?? $request->username;

        if (is_numeric($login)) {
            $field = 'contact_no';
        } elseif (filter_var($login, FILTER_VALIDATE_EMAIL)) {
            $field = 'email';
        } else {
            $field = 'username';
        }

        $user = User::where([$field => $login])->first();

        if (! $user) {
            throw ValidationException::withMessages([$field => ucfirst($field).' or password not match.']);
        }

        if ($user->status === 'Suspended') {
            throw ValidationException::withMessages([$field => 'Your account has been suspended please contact support for more information.']);
        }

        if (Hash::check($request->password, $user->password)) {
            $token = $user->createToken('API TOKEN');

            return response()->json([
                'token' => $token->plainTextToken,
                'user' => User::with([])->find($user->id),
                'message' => 'Log in successfully.',
                'success' => true,
            ], 200);
        }

        throw ValidationException::withMessages([$field => ucfirst($field).' or password not match.']);
    }

    public function logOut() 
    {
        Session::flush();
        Auth::logout();
  
        return redirect(route('login'))->withSuccess('You are logout successfully');
    }
}