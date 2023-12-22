<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Auth;
use App\Models\{ User };
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\{ ProfileRequest, PasswordRequest };
use Illuminate\Support\Facades\Hash;
use App\Services\Authentication;
use Carbon\Carbon;

class ProfileController extends Controller
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
        return User::with([])->find(auth()->user()->id);
    }

    public function update(ProfileRequest $request)
    {
        User::find(auth()->user()->id)->update($request->all());

        return response()->json([
            'user' => User::with([])->find(auth()->user()->id),
            'message' => 'Updated Successfully!',
            'success' => true,
        ], 200);
    }

    public function updatePassword(PasswordRequest $request)
    {
        $request->merge([
            'password' => Hash::make($request->password),
        ]);

        auth()->user()->update($request->except(['password_confirmation']));

        return response()->json([
            'message' => 'Updated Successfully!',
            'success' => true,
        ], 200); 
    }

    public function updateProfilePhoto(Request $request)
    {
        User::find(auth()->user()->id)->update($request->all());

        return response()->json([
            'user' => User::with([])->find(auth()->user()->id),
            'message' => 'Updated Successfully!',
            'success' => true,
        ], 200);
    }
}
