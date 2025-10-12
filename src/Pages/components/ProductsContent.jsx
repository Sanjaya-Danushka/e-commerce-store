import React from 'react';

const ProductsContent = ({ theme }) => {
  return (
    <div className="space-y-10">
      <h2 className={`text-5xl font-bold ${theme.text} mb-10`}>Product Management</h2>
      <div className={`${theme.card} ${theme.border} rounded-3xl p-8 ${theme.shadow}`}>
        <p className={`${theme.textSecondary} text-lg`}>Product management interface will be integrated here...</p>
      </div>
    </div>
  );
};

export default ProductsContent;
