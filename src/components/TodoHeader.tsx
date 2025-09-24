import { Dispatch, SetStateAction } from 'react';
import { createTodo, USER_ID } from '../api/todos';
import { Todo } from '../types/Todo';

type Props = {
  todoTitle: string;
  setTodoTitle: Dispatch<SetStateAction<string>>;
  onTodoAdded: (todo: Todo) => void;
  onError: (error: string) => void;
  onAddingStart: () => void;
  onAddingEnd: () => void;
  isAdding: boolean;
};

export const TodoHeader: React.FC<Props> = ({
  todoTitle,
  setTodoTitle,
  onTodoAdded,
  onError,
  onAddingStart,
  onAddingEnd,
  isAdding,
}) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Перевіряємо, чи не пуста назва
    if (!todoTitle.trim()) {
      onError('Title should not be empty');

      return;
    }

    onAddingStart();
    try {
      const newTodo = await createTodo({
        userId: Number(USER_ID),
        title: todoTitle.trim(),
        completed: false,
      });

      // Оновлюємо список тудушок
      onTodoAdded(newTodo);

      // Очищуємо поле
      setTodoTitle('');
    } catch (error) {
      onError('Unable to add a todo');
    } finally {
      onAddingEnd();
    }
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={e => setTodoTitle(e.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
