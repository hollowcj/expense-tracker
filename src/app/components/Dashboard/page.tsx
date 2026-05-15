

const Dashboard = () => {
    return (
        <div style={{display:'flex' , justifyContent:'space-between', alignItems: 'center', paddingTop:'90px'}}>
            <div>
                <h1 style={{fontSize:'28px', fontWeight: 'bold', color: '#111827'}}>Welcome back, user</h1>
                <p style={{fontSize: '13px', color: '#9ca3af', marginTop: '3px'}}>Here is your overveiw for october</p>
            </div>

            <div style = {{width:'30px', height:'30px',borderRadius: '100px', backgroundColor:'#a1a1a1', display: 'flex', alignItems:'center', paddingLeft:'30px'}}>
                <p></p>
            </div>
        </div>
    );
};

export default Dashboard;