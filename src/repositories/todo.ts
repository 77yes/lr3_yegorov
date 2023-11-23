import { Task } from "@/models/task";

export interface ITodo extends Task {}

export interface ITodoRepository {
    save(task: Task): Promise<Task>;
    find(id: string): Promise<Task | null>;
    fetch(): Promise<Task[]>;
    delete(id: string): Promise<boolean>;
    createOrUpdate(id: string, title: string, description: string): Promise<Task>;
    updateStatus(id: string, status: string): Promise<Task>;  // Додайте новий метод
}

export class TodoLocalStorageRepository implements ITodoRepository {
    private getItems(): Task[] {
        const storedItems = localStorage.getItem('todos');
        return storedItems ? JSON.parse(storedItems) : [];
    }

    private setItems(items: Task[]): void {
        localStorage.setItem('todos', JSON.stringify(items));
    }

    save(task: Task): Promise<Task> {
        return new Promise((resolve) => {
            const items = this.getItems();
            const index = items.findIndex((item) => item.id === task.id);

            if (index !== -1) {
                items[index] = task;
                this.setItems(items);
            }

            resolve(task);
        });
    }

    find(id: string): Promise<Task | null> {
        return new Promise((resolve) => {
            const items = this.getItems();
            const result = items.find((item) => item.id === id);
            resolve(result || null);
        });
    }

    fetch(): Promise<Task[]> {
        return new Promise((resolve) => {
            resolve(this.getItems());
        });
    }

    delete(id: string): Promise<boolean> {
        return new Promise((resolve) => {
            const items = this.getItems();
            const filteredItems = items.filter((item) => item.id !== id);
            this.setItems(filteredItems);
            resolve(true);
        });
    }

    createOrUpdate(id: string, title: string, description: string): Promise<Task> {
        return new Promise((resolve) => {
            const items = this.getItems();
            const index = items.findIndex((item) => item.id === id);

            if (index !== -1) {
                const task = items[index];
                task.title = title;
                task.description = description;
                this.setItems(items);
                resolve(task);
            } else {
                const task = new Task(id, title, description);
                items.push(task);
                this.setItems(items);
                resolve(task);
            }
        });
    }

    updateStatus(id: string, status: string): Promise<Task> {
        return new Promise((resolve) => {
            const items = this.getItems();
            const index = items.findIndex((item) => item.id === id);

            if (index !== -1) {
                items[index] = { ...items[index], status };
                this.setItems(items);
                resolve(items[index]);
            } else {
                // Обробка помилки, якщо задачу з вказаним id не знайдено
                resolve(null as any);
            }
        });
    }
}
