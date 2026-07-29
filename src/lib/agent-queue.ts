type Task = () => Promise<unknown>;

interface QueueItem {
  id: string;
  name: string;
  task: Task;
}

class AgentTaskQueue {
  private queue: QueueItem[] = [];
  private activeCount = 0;
  private maxConcurrency = 5;

  /**
   * Enqueue a background AI Agent task.
   * Controls execution concurrency to avoid LLM Provider Rate Limits.
   */
  enqueue(name: string, task: Task) {
    const id = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.queue.push({ id, name, task });
    this.processNext();
  }

  private async processNext() {
    if (this.activeCount >= this.maxConcurrency || this.queue.length === 0) {
      return;
    }

    const item = this.queue.shift();
    if (!item) return;

    this.activeCount++;

    try {
      await item.task();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn(`[AGENT QUEUE NOTICE - ${item.name}]:`, msg);
    } finally {
      this.activeCount--;
      // Small cooldown between tasks to prevent burst spikes
      setTimeout(() => this.processNext(), 50);
    }
  }
}

const globalQueue = new AgentTaskQueue();

export function enqueueAgentTask(name: string, task: Task): void {
  globalQueue.enqueue(name, task);
}
