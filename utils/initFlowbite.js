// initFlowbite.js
import { initFlowbite } from 'flowbite';

export function initializeFlowbite() {
  if (typeof window !== 'undefined') {
    setTimeout(()=>{
      initFlowbite();
    },50)
  }
}