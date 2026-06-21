const cloudinary = require('cloudinary').v2;

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: 'dbndgotx4', // ← replace this
  api_key: '416588362893671', // ← replace this
  api_secret: 'uthm9ainFR7CknsYSuVtEM9e9kA' // ← replace this
});

async function run() {
  try {
    // 2. Upload an image
    console.log('Uploading sample image...');
    const uploadResult = await cloudinary.uploader.upload(
      'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'
    );
    
    console.log('\\n--- Upload Successful ---');
    console.log('Secure URL:', uploadResult.secure_url);
    console.log('Public ID:', uploadResult.public_id);

    // 3. Get image details
    console.log('\\n--- Image Metadata ---');
    console.log('Width:', uploadResult.width);
    console.log('Height:', uploadResult.height);
    console.log('Format:', uploadResult.format);
    console.log('File size (bytes):', uploadResult.bytes);

    // 4. Transform the image
    // f_auto: Automatically chooses the most optimized format (e.g., WebP or AVIF) based on the requesting browser.
    // q_auto: Automatically adjusts the image quality to reduce file size without visible degradation.
    const transformedUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: 'auto',
      quality: 'auto'
    });

    console.log('\\n--- Transformation ---');
    console.log('Done! Click link below to see optimized version of the image. Check the size and the format.');
    console.log('Transformed URL:', transformedUrl);

  } catch (error) {
    console.error('Error during Cloudinary operation:', error);
  }
}

run();
