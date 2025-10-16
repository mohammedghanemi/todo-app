import { render, screen } from '@testing-library/react';
import App from './App';

test('renders main application elements', () => {
  render(<App />);
  
  // تحقق من العناصر الرئيسية بشكل دقيق
  expect(screen.getByText(/📝 قائمة المهام/i)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /تسجيل الدخول/i })).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/أدخل اسم المستخدم/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/أدخل كلمة المرور/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /تسجيل الدخول/i })).toBeInTheDocument();
});

test('displays demo information text', () => {
  render(<App />);
  const demoInfo = screen.getByText(/للمعاينة: يمكن استخدام أي اسم مستخدم/i);
  expect(demoInfo).toBeInTheDocument();
});

test('login form has required attributes', () => {
  render(<App />);
  
  const usernameInput = screen.getByPlaceholderText(/أدخل اسم المستخدم/i);
  const passwordInput = screen.getByPlaceholderText(/أدخل كلمة المرور/i);
  const submitButton = screen.getByRole('button', { name: /تسجيل الدخول/i });
  
  expect(usernameInput).toBeRequired();
  expect(passwordInput).toBeRequired();
  expect(submitButton).toHaveAttribute('type', 'submit');
});

test('renders login form labels correctly', () => {
  render(<App />);
  
  expect(screen.getByText(/اسم المستخدم:/i)).toBeInTheDocument();
  expect(screen.getByText(/كلمة المرور:/i)).toBeInTheDocument();
});