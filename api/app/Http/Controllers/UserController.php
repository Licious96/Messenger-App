<?php

namespace App\Http\Controllers;

use App\Models\Contacts;
use App\Models\User;
use App\Models\Messages;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

use function PHPUnit\Framework\returnSelf;

class UserController extends Controller
{
    public function register(Request $request){
        $fields = Validator::make(
            $request->all(),
            [
                'email' => 'required|email|unique:users,email',
                'contacts' => 'required|digits:10|unique:users,contacts',
                'password' => 'required|string|confirmed|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/'
            ]
        );

        if ($fields->fails()) {
            return response()->json($fields->errors(), 400);
        }

        $user = User::create([
            'contacts' => $request['contacts'],
            'email' => $request['email'],
            'password' => bcrypt($request['password'])
        ]);

        return response()->json($user, 200);
    }

    public function addProfile(Request $request, $id){
        $fields = Validator::make(
            $request->all(),
            [
                'username' => 'required|string|regex:/(^([a-zA-Z ]+)(\d+)?$)/u',
            ]
        );

        if ($fields->fails()) {
            return response()->json($fields->errors(), 400);
        }

        $user = User::find($id);

        if ($request->image === null) {
            $user->username = $request->username;
            $user->save();
            return response()->json($user, 201);
        }else{
            $user->username = $request->username;
            $user->image = $request->image;
            $user->save();
            return response()->json($user, 201);
        }
    }

    public function login(Request $request)
    {

        $fields = Validator::make(
            $request->all(),
            [
                'username' => 'required',
                'password' => 'required'
            ]
        );

        if ($fields->fails()) {
            return response()->json($fields->errors(), 400);
        }

        $user = User::where('email', $request['username'])->orWhere('contacts', $request['username'])->first();

        if (!$user) {
            return response()->json(['usernameError' => 'Your email/contacts is not registered'], 401);
        }elseif ($user && !Hash::check($request['password'], $user->password)) {
            return response()->json(['passwordError' => 'You have entered an incorrect password'], 401);
        }

        return response()->json($user, 200);
    }

    public function getUser($id){
        return response()->json(User::find($id), 200);
    }

    public function updateProfile(Request $request, $id){
        $fields = Validator::make(
            $request->all(),
            [
                'username' => 'required|string|regex:/(^([a-zA-Z ]+)(\d+)?$)/u',
                'image' => 'required',
                // 'email' => 'required|string|email',
                // 'contacts' => 'required|digits:10',
                // 'password' => 'required|string|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/'
            ]
        );

        if ($fields->fails()) {
            return response()->json($fields->errors(), 400);
        }

        $user = User::find($id);

        if ($request->image === null) {
            $user->username = $request->username;
            $user->save();
            return response()->json($user, 201);
        }else{
            $user->username = $request->username;
            $user->image = $request->image;
            $user->save();
            return response()->json($user, 201);
        }
    }

    public function getFriends($id){
        $ids1 = Contacts::where('user_one', $id)->pluck('user_two')->toArray();
        $ids2 = Contacts::where('user_two', $id)->pluck('user_one')->toArray();
        $ids = array_merge($ids1, $ids2);
        $sorted = User::whereIn('id', $ids)->get();    
        return response()->json($sorted, 200);
    }

    public function sendMessage(Request $request, $id){
        $user = Messages::create([
            'sender_id' => $request['contacts'],
            'email' => $request['email'],
            'password' => bcrypt($request['password'])
        ]);

        return response()->json($user, 200);
    }

    public function addContact(Request $request, $id){

        $date = date('H:i:s');
        $conv_id = preg_replace("/[^A-Za-z0-9]/", "", $date);

        $fields = Validator::make(
            $request->all(),
            [
                'contact' => 'required',
            ]
        );

        if ($fields->fails()) {
            return response()->json($fields->errors(), 400);
        }

        $user = User::where('email', $request['contact'])->orWhere('contacts', $request['contact'])->first();

        if (!$user) {
            return response()->json(['msg'=>'The contact you are trying to add does not have a chat messenger app'], 404);
        }

        if ($user->id == $id) {
            return response()->json(['msg'=>'You cannot add yourself as your contact'], 401);
        }

        $check = Contacts::where('user_one', $id)->where('user_two', $user->id)->orWhere('user_one', $user->id)->orWhere('user_two', $id)->first();

        if ($check) {
            return response()->json(['msg'=>'This contact is already on your contact list'], 401);
        }

        $friends = Contacts::create([
            'user_one' => $id,
            'user_two' => $user->id,
            'conv_id' => $conv_id,
        ]);

        return response()->json($friends, 200);

    }

    public function deleteContact($userOne, $userTwo){
        $result = Contacts::where('user_one', $userOne)->where('user_two', $userTwo)->first();
        $result->delete();
        return response()->json(201);
    }

    public function sendMsg($user_one, $user_two, $text){
        $users = Contacts::where('user_one',$user_one)->where('user_two', $user_two)->orWhere(function($query) use($user_one, $user_two) {
			$query->where('user_one', $user_two)->where('user_two', $user_one);
        })->first();

        $conv_id = $users->conv_id;

        $newMsg = Messages::create([
            'user_one' => $user_one,
            'user_two' => $user_two,
            'conv_id' => $conv_id,
            'text' => $text,
        ]);

        return $newMsg;
    }

    public function getMessages($user_one, $user_two){
    
        $users = Contacts::where('user_one',$user_one)->where('user_two', $user_two)->orWhere(function($query) use($user_one, $user_two) {
			$query->where('user_one', $user_two)->where('user_two', $user_one);
        })->first();

        $msg = Messages::where('conv_id', $users->conv_id)->get();
        return response()->json($msg, 200);

    }
}
