import { Spinner } from 'react-bootstrap';

export default function CustomSpinner(){
    return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}>
        <Spinner variant='primary' style={{height:'60px',width:'60px'}} />
     </div>
}