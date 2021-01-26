<?php

  use App\Http\Controllers\RoomController;
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

// Group fetch functions together
Route::prefix('fetch')->group(function() {
  Route::get('init_data', [RoomController::class, 'init']);
  Route::get('rooms', [RoomController::class, 'fetchRooms']);
});
