<?php

namespace App\Http\Controllers;

use Auth;
use Hash;
use DB;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use App\Services\Authentication;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Cache;
use App\Http\Requests\{ RegisterRequest, VerificationCodeRequest };
use App\Helpers\Utils;
use Carbon\Carbon;
use App\Services\Notification;

class RegisterController extends Controller
{
    private $authentication;

    public function __construct(
        Authentication $authentication
    )
    {
        $this->authentication = $authentication;
    }

    public function index(Request $request)
    {
        return view('auth.register', $request->all());
    }

    public function register(RegisterRequest $request)
    {
        $verification = $this->authentication->generateTokenCodeForEmail($request->first_name, $request->email);

        return response()->json([
            'token' => $verification['token'],
            'message' => 'Registration details are valid.',
            'success' => true,
        ], 200);
    }

    public function sendOTPCode(RegisterRequest $request)
    {
        $verification = $this->authentication->generateTokenCodeForEmail($request->first_name, $request->email);

        return response()->json([
            'token' => $verification['token'],
            'message' => 'Code Sent Successfully.',
            'success' => true,
        ], 200);
    }

    public function verifyOTPCode(VerificationCodeRequest $request)
    {
        $verification = Cache::get('verification.'.$request->email);

        if (! $verification || ($verification['code'] !== $request->code) || ($verification['token'] !== $request->token)) {
            throw ValidationException::withMessages(['code' => 'Invalid or expired code.']);
        }

        $request->merge([
            'is_active' => true,
            'status' => 'Active',
            'password' => Hash::make($request->password),
        ]);
        $user = User::create($request->except(['token', 'code', 'password_confirmation']));
        $user->markEmailAsVerified();

        return response()->json([
            'user' => User::with([])->find($user->id),
            'token' => $user->createToken('API TOKEN')->plainTextToken,
            'message' => 'Email Verified Successfully.',
            'success' => true,
        ], 200);
    }
}
