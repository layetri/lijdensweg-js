<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/


Broadcast::channel('room.{room}', function($user, $room) {
  return true;
});

Broadcast::channel('presence.{room}', function($user, $room) {
  return ['name' => $user->name, 'id' => $user->id];
});
