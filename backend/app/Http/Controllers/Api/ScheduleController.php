<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ScheduleController extends Controller
{
    public function index()
    {
        $schedules = Schedule::orderBy('event_date', 'asc')->get();
        return response()->json($schedules);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'location' => 'nullable|string|max:255',
                'event_date' => 'required|date',
                'event_time' => 'nullable|date_format:H:i',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
                'pencatat_ncs' => 'nullable|string|max:50',
                'pencatat_nama' => 'nullable|string|max:255',
            ]);

            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('schedules', 'public');
                $validated['image'] = $path;
            }

            $schedule = Schedule::create($validated);
            return response()->json($schedule, 201);
        } catch (\Exception $e) {
            return response()->json([
                "message" => $e->getMessage()
            ]);
        }
    }

    public function show(Schedule $schedule)
    {
        return response()->json($schedule);
    }

    public function update(Request $request, Schedule $schedule)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'event_date' => 'required|date',
            'event_time' => 'nullable|date_format:H:i',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'pencatat_ncs' => 'nullable|string|max:50',
            'pencatat_nama' => 'nullable|string|max:255',
        ]);

        if ($request->hasFile('image')) {
            if ($schedule->image) {
                Storage::disk('public')->delete($schedule->image);
            }
            $path = $request->file('image')->store('schedules', 'public');
            $validated['image'] = $path;
        }

        $schedule->update($validated);
        return response()->json($schedule);
    }

    public function destroy(Schedule $schedule)
    {
        if ($schedule->image) {
            Storage::disk('public')->delete($schedule->image);
        }
        $schedule->delete();
        return response()->json(['message' => 'Schedule deleted successfully']);
    }
}
