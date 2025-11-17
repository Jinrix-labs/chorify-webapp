export const generateIcon = (familyName: string, size: number, avatar?: string): string => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#8b5cf6');
  gradient.addColorStop(1, '#ec4899');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  if (avatar) {
    ctx.font = `${size * 0.6}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(avatar, size / 2, size / 2);
  } else {
    ctx.fillStyle = 'white';
    ctx.font = `bold ${size * 0.4}px "Fredoka", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const initials = familyName.slice(0, 2).toUpperCase();
    ctx.fillText(initials, size / 2, size / 2);
  }
  
  return canvas.toDataURL('image/png');
};
