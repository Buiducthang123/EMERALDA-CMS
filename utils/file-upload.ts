export const toBase64 = (file: Blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (reader.result !== null && typeof reader.result === 'string') {
          resolve(reader.result.split(',')[1]);
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

export const handleUploadImg = async (fileList: any[], loading?:boolean) => {
    if(loading==false )loading = true;
    const apiKey = '14cc7136f05a039beb83d8183385e78b';
    const url = `https://api.imgbb.com/1/upload?key=${apiKey}`;
  
    for (let file of fileList) {
      if (file.uploaded) continue; // Skip already uploaded files
  
      const formData = new FormData();
      const base64String = await toBase64(file.originFileObj);
      formData.append('image', base64String as Blob);
  
      try {
        const response = await fetch(url, {
          method: 'POST',
          body: formData
        });
        const result = await response.json();
        file.uploaded = true; // Mark file as uploaded
        message.success('Upload ảnh thành công');
        return result.data.url;
      } catch (error) {
        message.error('Upload ảnh thất bại');
      }
    }
    if( loading )loading = false;
  };