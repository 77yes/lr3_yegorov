<template>
  <div class="todo">
    <div class="card text-left">
      <div class="card-header">
        ToDo Component
      </div>
      <div class="card-body">
        <h5 class="card-title">My tasks</h5>
        <div class="card-text">
          <form>
            <div class="form-group">
              <label for="task-title">Task title</label>
              <input v-model="model.title" type="text" class="form-control" id="task-title" aria-describedby="emailHelp">
            </div>
            <div class="form-group">
              <label for="task-desc">Task description</label>
              <textarea v-model="model.description" class="form-control" id="task-desc"></textarea>
            </div>
            <button type="submit" class="btn btn-primary" @click.prevent="submit" :disabled="!isValid">Submit</button>
          </form>

          <ul class="pt-3">
            <li v-for="(item, index) in filteredTaskList" :key="index" class="d-flex justify-content-between mb-3">
              <div v-if="item">
                <h4 v-if="item.status === 'completed'"><s>{{item.title}}</s></h4>
                <h4 v-else>{{item.title}}</h4>
                <p>{{item.description}}</p>
              </div>
              <div class="d-flex">
                <button class="btn btn-danger mr-2" @click="deleteTask(item.id)">Delete</button>
                <button class="btn btn-warning" @click="prepareForEdit(item)">Change Task</button>
                <button class="btn btn-primary" @click="completeTask(item.id)">Completed</button>
              </div>
            </li>
          </ul>
        </div>
        <div class="card-footer">
          <button class="btn" :class="{ 'btn-primary': filterStatus }" @click="filterStatus = ''">All</button>
          <button class="btn" :class="{ 'btn-primary': filterStatus === 'completed' }" @click="filterStatus = 'completed'">Completed</button>
          <button class="btn" :class="{ 'btn-primary': filterStatus === 'incompleted' }" @click="filterStatus = 'incompleted'">InCompleted</button>
          Active tasks count: {{ filteredTaskList.length }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Task } from '@/models/task';
import { ITodo, TodoLocalStorageRepository } from '@/repositories/todo';


interface Data {
  model: Task;
  taskItems: ITodo[];
  filterStatus: string;
  loading: boolean;
  message: string;
  editingTaskId: string;
  editingTaskTitle: string;
  editingTaskDescription: string;
  $services: {
    todo: TodoLocalStorageRepository;
  };
}

export default defineComponent({
  name: 'ToDo',
  data(): Data {
    return {
      model: new Task(),
      taskItems: [],
      filterStatus: '',
      loading: false,
      message: '',
      editingTaskId: '',
      editingTaskTitle: '',
      editingTaskDescription: '',
      $services: {
        todo: new TodoLocalStorageRepository(),
      },
    };
  },
  computed: {
    isValid() {
      return this.model.title && this.model.description;
    },
    filteredTaskList() {
      return this.taskItems.filter((item: ITodo) => {
        if (!this.filterStatus) return true;
        return item.status === this.filterStatus;
      }) as Task[];
    },
  },
  async mounted() {
    this.loading = true;
    this.taskItems = await this.$services.todo.fetch();
    this.loading = false;
  },
  methods: {
    async submit() {
      const res = await this.$services.todo.save(this.model);
      this.taskItems.push(res);
      this.model = new Task();
    },

    async deleteTask(id: string) {
      const confirmed = window.confirm('Are you sure you want to delete this task?');
      if (confirmed) {
        const success = await this.$services.todo.delete(id);

        if (success) {
          this.taskItems = this.taskItems.filter((item) => item.id !== id);
        } 
      }
    },

    prepareForEdit(item: Task) {
      this.editingTaskId = item.id;
      this.editingTaskTitle = item.title;
      this.editingTaskDescription = item.description;

      // Передача значень до полів редагування
      this.model.title = this.editingTaskTitle;
      this.model.description = this.editingTaskDescription;

      // Після підготовки для редагування видаляємо елемент зі списку
      this.taskItems = this.taskItems.filter((task) => task.id !== item.id);
    },

    async updateTask() {
      const res = await this.$services.todo.createOrUpdate(
          this.editingTaskId,
          this.editingTaskTitle,
          this.editingTaskDescription
      );

      // Оновлюємо або додаємо завдання до списку
      this.taskItems.push(res);

      // Зачистимо дані редагування
      this.editingTaskId = '';
      this.editingTaskTitle = '';
      this.editingTaskDescription = '';
    },

    async completeTask(id: string) {
      const updatedTask = await this.$services.todo.updateStatus(id, 'completed');
      const index = this.taskItems.findIndex((item) => item.id === id);

      if (index !== -1) {       
        this.taskItems[index] = updatedTask;
      }
    },
  }
});
</script>

<style scoped>
.todo {
  background-color: aqua;
}
</style>
