<?php

namespace App\Http\Controllers;

use App\Models\Situation;
use Illuminate\Http\Request;

class SituationController extends Controller
{
    /*
     * Request should contain:
     * - sanity level
     * - turn number
     */
    public function takeOne(Request $request) {
      if(!empty($request->input('turn_number'))) {
        $past = json_decode($request->input('stack'));
        $data['card'] = Situation::whereNotIn('id', $past)->where('min_progress', '<=', $request->input('turn_number'))->inRandomOrder()->first();

        $data['options'] = $data['card']->options()->where('min_sanity', '<=', $request->input('sanity'))->where('max_sanity', '>=', $request->input('sanity'))->get();

        return $data;
      } else {
        return response('Not enough arguments to function. Requires turn_number, stack and sanity.', 500);
      }
    }
}
