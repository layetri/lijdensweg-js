<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BoardController extends Controller
{
    public function fetchBoard($room) {
      return Storage::get('board/'.$room.'.json');
    }

    public function storeBoard(Request $request) {
      $board = $request->input('board');
      Storage::put('board/'.$request->input('room').'.json', $board);
    }
}
