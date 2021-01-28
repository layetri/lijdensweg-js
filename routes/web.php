<?php

  use App\Http\Controllers\BoardController;
  use App\Http\Controllers\GameController;
  use App\Http\Controllers\RoomController;
  use App\Http\Controllers\SituationController;
  use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Present landing page
Route::get('/', [RoomController::class, 'knock']);
// Join a room
Route::post('join', [RoomController::class, 'checkIn']);

// Group set functions together
Route::prefix('set')->group(function() {
  Route::post('username', [RoomController::class, 'changeNickname']);
  Route::post('board', [BoardController::class, 'storeBoard']);
});

// Group fetch functions together
Route::prefix('fetch')->group(function() {
  Route::get('init_data', [RoomController::class, 'init']);
  Route::get('rooms', [RoomController::class, 'fetchRooms']);
  Route::get('board/{room}', [BoardController::class, 'fetchBoard']);

  Route::get('card', [SituationController::class, 'takeOne']);
  Route::get('dice', [GameController::class, 'rollDice']);
});

Route::prefix('admin')->middleware(['admin'])->group(function() {
  Route::get('/', function() {
    return view('admin');
  });

  Route::get('situations', [SituationController::class, 'loadAll']);
  Route::post('situation', [SituationController::class, 'make']);
});
