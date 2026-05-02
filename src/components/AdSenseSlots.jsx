const AdSenseSlots = ({ position = 'sidebar' }) => {
  const adSlots = {
    header: '1234567890', // Replace with your AdSense ad slot ID
    sidebar: '0987654321',
    footer: '1122334455',
    inContent: '5566778899',
  };

  const adStyle = position === 'header'
    ? { width: '100%', height: '90px' }
    : position === 'sidebar'
    ? { width: '300px', height: '250px' }
    : { width: '100%', height: '90px' };

  return (
    <div className={`adsense-wrapper ${position} my-4`}>
    {/* Replace this with your actual AdSense code */}
      <div
        className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center"
        style={adStyle}
      >
        <p className="text-gray-500 text-sm">Reklamné miesto ({position})</p>
        {/* Real AdSense code will be inserted here when approved */}
        {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
           <ins className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-YOUR_CLIENT_ID"
                data-ad-slot={adSlots[position]}
                data-ad-format="auto"></ins>
           <script>(adsbygoogle = window.adsbygoogle || []).push({});</script> */}
      </div>
    </div>
  );
};

export default AdSenseSlots;
