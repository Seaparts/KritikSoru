import { GlobalFonts } from '@napi-rs/canvas';
GlobalFonts.registerFromPath('PatrickHand-Regular.ttf', 'PatrickHand');
console.log(GlobalFonts.families);
