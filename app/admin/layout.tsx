import { NextPage } from 'next';
import Sidebar from '../../components/sidebar/Sidebar'; // Adjust the import path as needed
import { Children } from 'react';

interface AdminPageProps {
    children:React.ReactNode;
}

const AdminPage: React.FC<AdminPageProps> = (props) => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
       {props.children}
      </div>
    </div>
  );
};

export default AdminPage;