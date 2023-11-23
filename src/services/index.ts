import { TodoLocalStorageRepository } from '@/repositories/todo';

const todoRepository = new TodoLocalStorageRepository();

interface Services {
    todo: TodoLocalStorageRepository;
}

const services: Services = {
    todo: todoRepository,
};

export default services;
