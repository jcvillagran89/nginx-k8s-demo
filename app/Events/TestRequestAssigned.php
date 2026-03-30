<?php

namespace App\Events;

use App\Models\TestRequest;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TestRequestAssigned implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public TestRequest $test,
        public string $message,
        public ?int $userId = null,
    ) {}

    public function broadcastOn(): array
    {
        if ($this->userId) {
            return [new PrivateChannel("test-requests.{$this->userId}")];
        }

        return [new Channel('public-channel')];
    }

    public function broadcastWith(): array
    {
        $latestTest = $this->test->test()->latest('id')->first();

        return [
            'test_request_id' => $this->test->id,
            'test_id' => $latestTest?->id,
            'reference' => $this->test->number,
            'assigned_to' => optional($this->test->technician)->name,
            'summary' => $this->message,
            'url' => $latestTest ? route('test-results.detail', ['test' => $latestTest->id]) : null,
        ];
    }

    public function broadcastAs(): string
    {
        return 'TestRequestAssigned';
    }
}
