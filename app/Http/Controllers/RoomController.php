<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserRoom;
use Faker\Provider\Miscellaneous;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class RoomController extends Controller
{
  public function knock(Request $request) {
    if(Auth::guest()) {
      $u = User::create([
          'name' => 'Anoniem' . rand(100, 999) . ' ' . Miscellaneous::emoji()
      ]);

      Auth::loginUsingId($u->id, true);
    }

    return view('landing');
  }

  public function checkIn(Request $request) {
    $u = Auth::user();

    if(empty($request->input('room')) || $request->input('room') == "null") {
      $room_id = Str::random(6);
    } else {
      $room_id = $request->input('room');
    }

    if(!in_array($room_id, $u->rooms())) {
      UserRoom::create([
          'user_id' => $u->id,
          'room' => $room_id
      ]);
    }

    return ['user' => $u, 'room' => $room_id];
  }

  public function init() {
    if(!Auth::guest()) {
      $data['user'] = Auth::user();
      $data['exist'] = true;

      return $data;
    }
  }

  public function fetchRooms() {
    if(!Auth::guest()) {
      return Auth::user()->rooms();
    }
  }

  public function changeNickname(Request $request) {
    if(Auth::check()) {
      Auth::user()->update(['name' => $request->input('name')]);
      return response('Success', 201);
    } else {
      return response('Unauthorized', 419);
    }
  }

  public function destroyUser(Request $request) {
    if(Auth::check()) {
      $id = Auth::id();
      Auth::logout();

      User::where('id', $id)->first()->delete();
    }
  }
}
