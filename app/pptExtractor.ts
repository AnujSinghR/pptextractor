import JSZip from 'jszip';

export interface SlideData {
  text: string;
  images: string[];
}

export const extractPptData = async (file: File): Promise<SlideData[]> => {
  const zip = new JSZip();
  const pptx = await zip.loadAsync(file);

  const slides: SlideData[] = [];
  const slideRegex = /^ppt\/slides\/slide(\d+).xml$/;

  for (const [path, fileObj] of Object.entries(pptx.files)) {
    const match = path.match(slideRegex);

    if (match) {
      const content = await fileObj.async('text');

      // Extract text
      const textMatches = Array.from(content.matchAll(/<a:t>(.*?)<\/a:t>/g));
      const text = textMatches.map((match) => match[1]).join(' ');

      // Extract images
      const imagePaths: string[] = [];
      const relsPath = path.replace('slides/slide', '_rels/slides/slide').replace('.xml', '.xml.rels');
      
      if (pptx.files[relsPath]) {
        const relsContent = await pptx.files[relsPath].async('text');
        const imageMatches = Array.from(relsContent.matchAll(/Target="([^"]+?)"/g));
        
        for (const imgMatch of imageMatches) {
          const imgPath = imgMatch[1].startsWith('/') ? imgMatch[1].substring(1) : imgMatch[1];
          
          if (pptx.files[imgPath]) {
            const imgBlob = new Blob([await pptx.files[imgPath].async('arraybuffer')]);
            const imgUrl = URL.createObjectURL(imgBlob);
            imagePaths.push(imgUrl);
          }
        }
      }

      slides.push({ text, images: imagePaths });
    }
  }

  return slides;
};
