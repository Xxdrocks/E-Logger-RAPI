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
         Schema::create('approvals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('log_id')->nullable()->constrained('logs')->onDelete('cascade');
            $table->string('frequency');
            $table->string('keterangan')->nullable();
            $table->string('ncs_1028');
            $table->string('nama')->nullable();
            $table->string('zzd')->nullable();
            $table->string('pencatat_ncs');
            $table->string('pencatat_nama')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
            $table->index('status');
            $table->index('ncs_1028');
            $table->index('pencatat_ncs');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('approvals');
    }
};
