<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       Schema::table('schedules', function (Blueprint $table) {
            $table->string('pencatat_ncs', 50)->nullable()->after('event_time');
            $table->string('pencatat_nama')->nullable()->after('pencatat_ncs');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
       Schema::table('schedules', function (Blueprint $table) {
            $table->dropColumn(['pencatat_ncs', 'pencatat_nama']);
        });
    }
};
