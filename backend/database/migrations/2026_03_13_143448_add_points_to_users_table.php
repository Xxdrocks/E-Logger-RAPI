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
        Schema::table('users', function (Blueprint $table) {
            $table->integer('points')->default(0)->after('role');
            $table->integer('total_as_pencatat')->default(0)->after('points');
            $table->integer('total_as_participant')->default(0)->after('total_as_pencatat');
            $table->timestamp('points_last_updated')->nullable()->after('total_as_participant');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['points', 'total_as_pencatat', 'total_as_participant', 'points_last_updated']);
        });
    }
};
