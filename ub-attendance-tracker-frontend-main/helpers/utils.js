import getConfig from 'next/config';

import { userService } from 'services';
import { toast } from 'react-toastify';
import FormData from 'form-data';
import { useRouter } from 'next/router';


export function useRouteHandler(userRole) {
    const router = useRouter();
  
    function handleRouteChange() {
      if (userRole === 'ADMIN') {
        router.replace('/metrics/spaces');
      } else if (userRole === 'USER') {
        router.replace('/myProfile');
      } else if (userRole === 'PRESENTER' || userRole === 'ASSISTANT') {
        router.replace('/spaces');
      } 
    }
  
    return handleRouteChange;
}

export function tempy() {
    const router = useRouter();
  
    function handleRouteChange() {
      if (userService.userRoleValue === 'ADMIN') {
        router.replace('/metrics/spaces');
      } else if (userService.userRoleValue === 'USER') {
        router.replace('/myProfile');
      } else if (userService.userRoleValue === 'PRESENTER' || userService.userRoleValue === 'ASSISTANT') {
        router.replace('/spaces');
      }
    }
  
    return handleRouteChange;
}


