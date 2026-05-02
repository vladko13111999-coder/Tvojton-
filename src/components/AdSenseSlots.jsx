const AdSenseSlots = ({ position = 'header' }) => {
  const adStyle = position === 'header'
    ? { width: '100%', height: '90px' }
    : { width: '300px', height: '250px' };

  return (
    <div className="my-4 flex justify-center">
      <div
        className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center"
        style={adStyle}
      >
        <p className="text-gray-500 text-sm">Reklamné miesto ({position})</p>
      </div>
    </div>
  );
};

export default AdSenseSlots;
