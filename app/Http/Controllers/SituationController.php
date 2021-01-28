<?php

namespace App\Http\Controllers;

use App\Models\Situation;
use App\Models\SituationOption;
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

    public function loadAll() {
      return Situation::get();
    }

    public function make(Request $request) {
      $s = $request->input('situation');

      $situation = Situation::create([
        'description' => $s['description'],
        'min_progress' => $s['min_turn']
      ]);

      foreach($s['options'] as $option) {
        SituationOption::create([
           'situation_id' => $situation->id,
           'description' => $option['description'],
           'min_sanity' => $option['sanity'][0],
           'max_sanity' => $option['sanity'][1],
           'action' => $option['action']
        ]);
      }

      return $situation;
    }
}
