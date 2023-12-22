<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

use App\Http\Controllers\{
    DashboardController,
    LoginController, 
    RegisterController,
    ForgotPasswordController,
    ResetPasswordController,
    ProfileController,
    SocketController,
    UserController,
    InboxController,
    FileController,
    NotificationController,
};

Route::post('login', [LoginController::class, 'index']);
Route::prefix('register')->group(function () {
    Route::post('/', [RegisterController::class, 'register']);
    Route::post('create-account', [RegisterController::class, 'createAccount']);
    Route::post('verify', [RegisterController::class, 'verifyOTPCode']);
});
Route::prefix('forgot-password')->group(function () {
    Route::post('send-otp', [ForgotPasswordController::class, 'sendOtp']);
    Route::post('verify-otp', [ForgotPasswordController::class, 'verifyOTPCode']);
});
Route::post('reset-password', [ResetPasswordController::class, 'resetPassword']);
Route::prefix('files')->group(function () {
    Route::post('upload', [FileController::class, 'upload']);
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('broadcasting/auth', [SocketController::class, 'broadcastingPresenceAuth']);
    Route::get('dashboard', [DashboardController::class, 'index']);
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::get('count', [NotificationController::class, 'count']);
    });
    Route::prefix('inbox')->group(function () {
        Route::get('/', [InboxController::class, 'index']);
        Route::get('/unread', [InboxController::class, 'unread']);
        Route::post('/create', [InboxController::class, 'create']);
        Route::get('/show/{conversation_id}', [InboxController::class, 'show']);
        Route::post('/send/{conversation_id}', [InboxController::class, 'send']);
    });
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'index']);
        Route::prefix('update')->group(function () {
            Route::post('/', [ProfileController::class, 'update']);
            Route::post('profile-photo', [ProfileController::class, 'updateProfilePhoto']);
            Route::post('password', [ProfileController::class, 'updatePassword']);
        });
    });
    Route::prefix('users')->group(function () {
        Route::get('role/{role_id}', [UserController::class, 'index']);
        Route::get('show/{id}', [UserController::class, 'show']);
        Route::post('create', [UserController::class, 'create']);
        Route::post('update/{id}', [UserController::class, 'update']);
        Route::post('delete', [UserController::class, 'delete']);
    });
});