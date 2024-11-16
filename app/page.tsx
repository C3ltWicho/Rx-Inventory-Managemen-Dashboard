import Image from "next/image";
import UserForm from './UserForm';
import Dashboard from './dashboard';
export default function Home() {
  return (
    <div>
      <h1>Submit a new user</h1>
      <UserForm />
      <Dashboard />
    </div>
  );
}
