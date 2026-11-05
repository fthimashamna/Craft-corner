import { useNavigate } from "react-router-dom";

function Settings(){
    const navigate = useNavigate();

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")||"null");

const handleLogout =()=>{
    localStorage.removeItem("loggedInUser");
    navigate("/login");
};
return(
    <div style={{
        minHeight:"100vh",
        backgroundColor:"#F5EBDD",
        padding:"40px 20px",
        color:"#5C3A25",
        fontFamily:"Georgia , serif",
        boxSizing:"border-box",
    }}>
        <div style={{maxWidth:"1000px",margin:"0 auto"}}>
            <h1 style={{fontSize:"32px", marginBottom:"8px"}}>
                Account Center
            </h1>
            <p style={{color:"#8B6B55",marginBottom:"30px"}}>
                Manage your account and preference
            </p>
            <div style={{
                display:"grid",
                gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",
                gap:"22px",

            }}>
                <div style={{
                    backgroundColor:"#FFFFFF",
                    padding:"25px",
                    borderRadius:"12px",
                    border:"1px solid 3D8C7B5",
                }}>
                    <h2 style={{marginTop:0}}>
                        My Profile
                    </h2>
                    <p style={{color:"#8B6B55"}}>Email Address</p>
                    <p style={{fontWeight:"bold",overflowWrap:"anywheree"}}>
                        {loggedInUser?.email || "Not available"}
                    </p>
                </div>
                <div style={{
                    backgroundColor:"#FFFFFF",
                    padding:"25px",
                    borderRadius:"12px",
                    border:"1px solid #D8C7B5",
                }}>
                    <h2 style={{marginTop:0}}>My Orders</h2>
                    <p style={{color:"#8B6B55",lineHeight:"1.6"}}>
                        View your orders and purchase details.
                    </p>
                    <button 
                    onClick={()=>navigate("/orders")}
                    style={buttonStyle}>
                        View Orders
                    </button>
                </div>
                <div style={{
                    backgroundColor:"#FFFFFF",
                    padding:"25px",
                    borderRadius:"12px",
                    border:"1px solid #D8C7B5",
                }}>
                    <h2 style={{marginTop:0}}>Account Settings</h2>
                    <p style={{color:"#8B6B55",lineHeight:"1.6"}}>
                        Your account details are displayed in myProfile
                    </p>
                </div>
            </div>
            <div style={{
                backgroundColor:"#FFFFFF",
                padding:"25px",
                borderRadius:"1px solid #D8C7B5",
                marginTop:"22px",
            }}>
                <h1 style={{marginTop:0}}>Logout</h1>
                <p style={{color:"#8B6B55"}}>
                    log out of your account on this device.
                </p>
                <button onClick={handleLogout}
                style={{
                    ...buttonStyle,
                    backgroundColor:"#8B3A3A",
                    borderColor:"#8B3A3A",
                }}>
                    Logout
                </button>
            </div>
        </div>

    </div>
);
}
const buttonStyle={
   backgroundColor: "#70452F",
  color: "#FFFFFF",
  border: "1px solid #70452F",
  padding: "11px 18px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px", 
};
export default Settings;
