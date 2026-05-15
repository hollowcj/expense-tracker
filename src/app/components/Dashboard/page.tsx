const Dashboard = () => {
    return (
        <div style={{display:'flex', justifyContent:'space-between', alignItems: 'center', paddingTop:'30px', paddingLeft:'32px', paddingRight:'50px'}}>
            <div>
                <h1 style={{fontSize:'28px', fontWeight: 'bold', color: '#111827'}}>Welcome back, user</h1>
                <p style={{fontSize: '13px', color: '#9ca3af', marginTop: '3px'}}>Here is your overview for October</p>
            </div>
        </div>
    );
};

export default Dashboard;