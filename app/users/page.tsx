import Header from "../_components/header";
import UsersList from "./_components/users-list";

const Users = () => {    
    return (
        <>
            <Header />
            <div className="px-5">
                <UsersList />
            </div>
        </>
    );
}

export default Users;
