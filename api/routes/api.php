<?php

use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::post('/addProfile/{id}', [UserController::class, 'addProfile']);
Route::get('/getUser/{id}', [UserController::class, 'getUser']);
Route::post('/updateProfile/{id}', [UserController::class, 'updateProfile']);
Route::get('/getFriends/{id}', [UserController::class, 'getFriends']);
Route::get('/sendMsg/{id1}/{id2}/{text}', [UserController::class, 'sendMsg']);
Route::post('/addContact/{id}', [UserController::class, 'addContact']);
Route::post('/deleteContact/{id1}/{id2}', [UserController::class, 'deleteContact']);
Route::get('/getMessages/{id1}/{id2}', [UserController::class, 'getMessages']);
Route::post('/createGroup/{id}', [UserController::class, 'createGroup']);
Route::post('/addParticipant/{id}', [UserController::class, 'addParticipant']);
Route::get('/getGroups/{id}', [UserController::class, 'getGroups']);
Route::get('/sendMessage/{id}/{conv_id}/{text}', [UserController::class, 'sendMessage']);
Route::get('/getMsgs/{id}/{conv_id}/', [UserController::class, 'getMsgs']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
