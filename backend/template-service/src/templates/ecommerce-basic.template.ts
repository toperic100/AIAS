
// backend/template-service/src/templates/ecommerce-basic.template.ts
import { Template } from '../types/template.types';

export const ecommerceBasicTemplate: Template = {
  id: 'ecommerce-basic',
  name: '电商基础版',
  description: '包含商品展示、购物车、订单管理等基础电商功能的模板',
  category: 'ecommerce',
  thumbnail: '/templates/ecommerce-basic-thumb.png',
  preview: '/templates/ecommerce-basic-preview.png',
  tags: ['电商', '购物车', '订单', '支付', '商品管理'],
  difficulty: 'beginner',
  downloads: 15234,
  rating: 4.7,
  author: 'App Builder Team',
  version: '1.0.0',
  createdAt: '2024-01-15T00:00:00Z',
  updatedAt: '2024-02-01T00:00:00Z',
  
  techStack: {
    frontend: ['React', 'TypeScript', 'TailwindCSS', 'React Query', 'Zustand'],
    backend: ['NestJS', 'TypeORM', 'PostgreSQL'],
    database: ['PostgreSQL', 'Redis'],
    deployment: ['Vercel', 'Railway'],
  },
  
  features: [
    '商品浏览和搜索',
    '购物车管理',
    '订单管理',
    '用户认证',
    '支付集成',
    '订单跟踪',
    '商品评价',
    '优惠券系统',
  ],
  
  specification: {
    appType: 'web',
    category: 'ecommerce',
    
    features: [
      {
        id: 'product-catalog',
        name: '商品目录',
        description: '展示商品列表,支持分类、搜索、筛选',
        priority: 'high',
        complexity: 6,
      },
      {
        id: 'shopping-cart',
        name: '购物车',
        description: '添加商品到购物车,管理购物车商品',
        priority: 'high',
        complexity: 7,
      },
      {
        id: 'checkout',
        name: '结账',
        description: '订单结算,填写收货信息,选择支付方式',
        priority: 'high',
        complexity: 8,
      },
      {
        id: 'order-management',
        name: '订单管理',
        description: '查看订单历史,跟踪订单状态',
        priority: 'high',
        complexity: 7,
      },
      {
        id: 'user-auth',
        name: '用户认证',
        description: '用户注册、登录、个人信息管理',
        priority: 'high',
        complexity: 6,
      },
      {
        id: 'product-reviews',
        name: '商品评价',
        description: '用户可以对购买的商品进行评价和评分',
        priority: 'medium',
        complexity: 5,
        optional: true,
      },
      {
        id: 'coupon-system',
        name: '优惠券',
        description: '优惠券创建、分发和使用',
        priority: 'medium',
        complexity: 6,
        optional: true,
      },
      {
        id: 'wishlist',
        name: '收藏夹',
        description: '用户可以收藏喜欢的商品',
        priority: 'low',
        complexity: 4,
        optional: true,
      },
    ],
    
    dataModels: [
      {
        name: 'User',
        description: '用户信息',
        fields: [
          { name: 'id', type: 'uuid', required: true },
          { name: 'email', type: 'string', required: true, unique: true, validation: 'email' },
          { name: 'password', type: 'string', required: true, validation: 'minLength:8' },
          { name: 'name', type: 'string', required: true },
          { name: 'phone', type: 'string', required: false, validation: 'phone' },
          { name: 'avatar', type: 'string', required: false },
          { name: 'addresses', type: 'array', required: false },
          { name: 'createdAt', type: 'date', required: true },
          { name: 'updatedAt', type: 'date', required: true },
        ],
        relationships: [
          { type: 'oneToMany', target: 'Order', description: '用户的所有订单' },
          { type: 'oneToMany', target: 'Review', description: '用户的所有评价' },
        ],
      },
      {
        name: 'Product',
        description: '商品信息',
        fields: [
          { name: 'id', type: 'uuid', required: true },
          { name: 'name', type: 'string', required: true },
          { name: 'description', type: 'string', required: true },
          { name: 'price', type: 'number', required: true, validation: 'min:0' },
          { name: 'originalPrice', type: 'number', required: false },
          { name: 'stock', type: 'number', required: true, defaultValue: 0 },
          { name: 'images', type: 'array', required: true },
          { name: 'category', type: 'string', required: true },
          { name: 'tags', type: 'array', required: false },
          { name: 'status', type: 'string', required: true, defaultValue: 'active' },
          { name: 'rating', type: 'number', required: false, defaultValue: 0 },
          { name: 'reviewCount', type: 'number', required: false, defaultValue: 0 },
          { name: 'createdAt', type: 'date', required: true },
          { name: 'updatedAt', type: 'date', required: true },
        ],
        relationships: [
          { type: 'oneToMany', target: 'Review', description: '商品的所有评价' },
          { type: 'oneToMany', target: 'CartItem', description: '购物车中的商品' },
        ],
        indexes: ['category', 'status', 'createdAt'],
      },
      {
        name: 'Order',
        description: '订单信息',
        fields: [
          { name: 'id', type: 'uuid', required: true },
          { name: 'userId', type: 'uuid', required: true },
          { name: 'orderNumber', type: 'string', required: true, unique: true },
          { name: 'items', type: 'array', required: true },
          { name: 'totalAmount', type: 'number', required: true },
          { name: 'shippingAddress', type: 'object', required: true },
          { name: 'paymentMethod', type: 'string', required: true },
          { name: 'paymentStatus', type: 'string', required: true, defaultValue: 'pending' },
          { name: 'orderStatus', type: 'string', required: true, defaultValue: 'pending' },
          { name: 'couponCode', type: 'string', required: false },
          { name: 'discount', type: 'number', required: false, defaultValue: 0 },
          { name: 'createdAt', type: 'date', required: true },
          { name: 'updatedAt', type: 'date', required: true },
        ],
        relationships: [
          { type: 'manyToOne', target: 'User', description: '订单所属用户' },
        ],
        indexes: ['userId', 'orderNumber', 'orderStatus'],
      },
      {
        name: 'CartItem',
        description: '购物车商品',
        fields: [
          { name: 'id', type: 'uuid', required: true },
          { name: 'userId', type: 'uuid', required: true },
          { name: 'productId', type: 'uuid', required: true },
          { name: 'quantity', type: 'number', required: true, defaultValue: 1 },
          { name: 'createdAt', type: 'date', required: true },
        ],
        relationships: [
          { type: 'manyToOne', target: 'User', description: '购物车所属用户' },
          { type: 'manyToOne', target: 'Product', description: '购物车中的商品' },
        ],
      },
      {
        name: 'Review',
        description: '商品评价',
        fields: [
          { name: 'id', type: 'uuid', required: true },
          { name: 'userId', type: 'uuid', required: true },
          { name: 'productId', type: 'uuid', required: true },
          { name: 'rating', type: 'number', required: true, validation: 'min:1,max:5' },
          { name: 'comment', type: 'string', required: true },
          { name: 'images', type: 'array', required: false },
          { name: 'helpful', type: 'number', required: false, defaultValue: 0 },
          { name: 'createdAt', type: 'date', required: true },
        ],
        relationships: [
          { type: 'manyToOne', target: 'User', description: '评价的用户' },
          { type: 'manyToOne', target: 'Product', description: '评价的商品' },
        ],
      },
    ],
    
    uiComponents: [
      {
        type: 'Header',
        name: 'AppHeader',
        properties: {
          logo: true,
          searchBar: true,
          cartIcon: true,
          userMenu: true,
        },
      },
      {
        type: 'ProductGrid',
        name: 'ProductList',
        page: 'home',
        properties: {
          columns: 4,
          showFilters: true,
          showPagination: true,
        },
        responsive: true,
      },
      {
        type: 'ProductCard',
        name: 'ProductItem',
        properties: {
          showQuickView: true,
          showAddToCart: true,
          showWishlist: true,
        },
      },
      {
        type: 'ShoppingCart',
        name: 'CartDrawer',
        properties: {
          position: 'right',
          showSummary: true,
        },
      },
      {
        type: 'CheckoutForm',
        name: 'CheckoutPage',
        page: 'checkout',
        properties: {
          steps: ['address', 'payment', 'review'],
          showProgress: true,
        },
      },
    ],
    
    businessLogic: [
      {
        name: '添加到购物车',
        trigger: '用户点击"加入购物车"按钮',
        actions: [
          '检查商品库存',
          '添加商品到购物车',
          '更新购物车数量',
          '显示成功提示',
        ],
        conditions: ['用户已登录', '商品有库存'],
        errorHandling: '库存不足时显示提示',
      },
      {
        name: '下单',
        trigger: '用户完成结账流程',
        actions: [
          '验证收货地址',
          '验证支付信息',
          '创建订单',
          '扣减库存',
          '清空购物车',
          '发送订单确认邮件',
        ],
        conditions: ['购物车不为空', '地址信息完整', '支付方式有效'],
        errorHandling: '订单创建失败时回滚库存',
      },
      {
        name: '提交评价',
        trigger: '用户提交商品评价',
        actions: [
          '保存评价内容',
          '更新商品平均评分',
          '更新评价数量',
          '给用户积分奖励',
        ],
        conditions: ['用户已购买该商品', '评价内容不为空'],
      },
    ],
    
    integrations: [
      {
        service: 'Stripe',
        purpose: '支付处理',
        required: true,
        configRequired: ['apiKey', 'webhookSecret'],
      },
      {
        service: 'SendGrid',
        purpose: '邮件通知',
        required: true,
        configRequired: ['apiKey', 'fromEmail'],
      },
      {
        service: 'Cloudinary',
        purpose: '图片存储',
        required: false,
        configRequired: ['cloudName', 'apiKey', 'apiSecret'],
      },
    ],
    
    designPreferences: {
      theme: 'light',
      colorScheme: 'blue',
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
      layout: 'modern',
      responsive: true,
      font: 'Inter',
    },
    
    routes: [
      { path: '/', name: '首页', component: 'HomePage' },
      { path: '/products', name: '商品列表', component: 'ProductsPage' },
      { path: '/products/:id', name: '商品详情', component: 'ProductDetailPage' },
      { path: '/cart', name: '购物车', component: 'CartPage' },
      { path: '/checkout', name: '结账', component: 'CheckoutPage', protected: true },
      { path: '/orders', name: '我的订单', component: 'OrdersPage', protected: true },
      { path: '/profile', name: '个人中心', component: 'ProfilePage', protected: true },
    ],
    
    apiEndpoints: [
      { method: 'GET', path: '/products', description: '获取商品列表' },
      { method: 'GET', path: '/products/:id', description: '获取商品详情' },
      { method: 'POST', path: '/cart', description: '添加到购物车', protected: true },
      { method: 'GET', path: '/cart', description: '获取购物车', protected: true },
      { method: 'POST', path: '/orders', description: '创建订单', protected: true },
      { method: 'GET', path: '/orders', description: '获取订单列表', protected: true },
      { method: 'POST', path: '/reviews', description: '提交评价', protected: true },
    ],
  },
  
  documentation: 'https://docs.appbuilder.com/templates/ecommerce-basic',
  repository: 'https://github.com/appbuilder/templates/ecommerce-basic',
};
