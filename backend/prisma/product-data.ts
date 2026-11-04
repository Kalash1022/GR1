import { ExchangeType, ProductCondition, ProductStatus } from '@prisma/client';

export const GENERATED_PRODUCT_COUNT = 250;

export const CATEGORY_SLUGS = [
  'electronics',
  'fashion',
  'furniture',
  'books',
  'sports',
  'vehicles',
  'home-appliances',
  'toys',
  'music',
  'other',
] as const;

type ProductCategorySlug = (typeof CATEGORY_SLUGS)[number];

export interface ProductSeedData {
  title: string;
  description: string;
  price: number | null;
  condition: ProductCondition;
  type: ExchangeType;
  status: ProductStatus;
  categorySlug: ProductCategorySlug;
  ownerEmail: string;
  images: string[];
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
}

interface ProductTemplate {
  title: string;
  description: string;
  imageUrl: string;
  imageSubject: string;
  basePrice: number;
}

const IMAGE = (photoId: string) =>
  `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=900&q=80`;

const LOCATIONS = [
  {
    address: 'Quận 1, TP. Hồ Chí Minh',
    latitude: 10.7769,
    longitude: 106.7009,
  },
  {
    address: 'Quận Bình Thạnh, TP. Hồ Chí Minh',
    latitude: 10.8016,
    longitude: 106.7118,
  },
  {
    address: 'Cầu Giấy, Hà Nội',
    latitude: 21.0381,
    longitude: 105.7723,
  },
  {
    address: 'Đống Đa, Hà Nội',
    latitude: 21.018,
    longitude: 105.8298,
  },
  {
    address: 'Ninh Kiều, Cần Thơ',
    latitude: 10.0371,
    longitude: 105.7882,
  },
  {
    address: 'Hải Châu, Đà Nẵng',
    latitude: 16.0544,
    longitude: 108.2022,
  },
] as const;

const OWNER_EMAILS = [
  'seller1@example.com',
  'seller2@example.com',
  'seller3@example.com',
  'buyer1@example.com',
  'buyer2@example.com',
  'buyer3@example.com',
  'lequangloi06032005@gmail.com',
] as const;

const CONDITIONS = [
  ProductCondition.NEW,
  ProductCondition.LIKE_NEW,
  ProductCondition.GOOD,
  ProductCondition.FAIR,
  ProductCondition.POOR,
] as const;

const CONDITION_NOTES: Record<ProductCondition, string> = {
  [ProductCondition.NEW]:
    'Sản phẩm chưa qua sử dụng, ngoại hình còn mới và sạch sẽ.',
  [ProductCondition.LIKE_NEW]:
    'Sản phẩm đã dùng rất ít, ngoại hình gần như mới.',
  [ProductCondition.GOOD]:
    'Sản phẩm hoạt động tốt, có một vài dấu vết sử dụng nhẹ.',
  [ProductCondition.FAIR]:
    'Sản phẩm đã qua sử dụng, có dấu vết thẩm mỹ nhưng vẫn dùng tốt.',
  [ProductCondition.POOR]:
    'Sản phẩm đã dùng nhiều, phù hợp với người chấp nhận vệ sinh hoặc bảo dưỡng thêm.',
};

const TYPE_NOTES: Record<ExchangeType, string> = {
  [ExchangeType.SELL]: 'Đang bán, có thể xem trực tiếp trước khi nhận.',
  [ExchangeType.EXCHANGE]:
    'Ưu tiên trao đổi với món đồ có giá trị sử dụng tương đương.',
  [ExchangeType.DONATE]: 'Tặng miễn phí cho người thực sự cần sử dụng.',
};

const PRODUCT_TEMPLATES: Record<
  ProductCategorySlug,
  readonly ProductTemplate[]
> = {
  electronics: [
    {
      title: 'Bàn phím cơ compact màu đen',
      description:
        'Bàn phím cơ layout gọn, keycap đen phối hai phím nhấn màu cam, phù hợp góc làm việc tối giản.',
      imageUrl: IMAGE('1618384887929-16ec33fab9ef'),
      imageSubject: 'bàn phím cơ compact màu đen với hai phím màu cam',
      basePrice: 1_250_000,
    },
    {
      title: 'Chuột không dây công thái học màu đen',
      description:
        'Chuột không dây màu đen, thân thấp gọn và có hai nút phụ bên hông, phù hợp làm việc lẫn chơi game.',
      imageUrl: IMAGE('1615663245857-ac93bb7c39e7'),
      imageSubject: 'chuột máy tính không dây màu đen',
      basePrice: 950_000,
    },
    {
      title: 'Máy tính để bàn all-in-one màn hình lớn',
      description:
        'Máy tính all-in-one màu bạc với màn hình rộng, bàn phím và chuột đồng bộ, phù hợp học tập hoặc văn phòng.',
      imageUrl: IMAGE('1527443224154-c4a3942d3acf'),
      imageSubject: 'máy tính all-in-one màu bạc',
      basePrice: 8_900_000,
    },
    {
      title: 'Tai nghe chụp tai Bluetooth màu đen',
      description:
        'Tai nghe chụp tai không dây màu đen, đệm tai lớn và thiết kế gập gọn, phù hợp nghe nhạc hằng ngày.',
      imageUrl: IMAGE('1505740420928-5e560c06d30e'),
      imageSubject: 'tai nghe chụp tai màu đen',
      basePrice: 1_600_000,
    },
    {
      title: 'Loa Bluetooth JBL màu đen',
      description:
        'Loa Bluetooth JBL dạng trụ màu đen, bọc lưới chắc chắn và thuận tiện mang theo trong các chuyến đi.',
      imageUrl: IMAGE('1608043152269-423dbba4e7e1'),
      imageSubject: 'loa Bluetooth JBL dạng trụ màu đen',
      basePrice: 2_100_000,
    },
    {
      title: 'iPhone Pro màu graphite',
      description:
        'Điện thoại iPhone dòng Pro màu graphite, cụm ba camera sau, thân máy sạch và không có vết nứt.',
      imageUrl: IMAGE('1678685888221-cda773a3dcdb'),
      imageSubject: 'iPhone Pro màu graphite với ba camera',
      basePrice: 18_900_000,
    },
  ],
  fashion: [
    {
      title: 'Combo quần jeans denim nhiều tông màu',
      description:
        'Combo quần jeans denim treo trên móc, gồm nhiều tông xanh từ nhạt đến đậm, dễ phối đồ hằng ngày.',
      imageUrl: IMAGE('1576995853123-5a10305d93c0'),
      imageSubject: 'nhiều quần jeans treo trên giá',
      basePrice: 480_000,
    },
    {
      title: 'Quần jeans nữ đính họa tiết',
      description:
        'Quần jeans nữ dáng ôm vừa, wash xanh đậm, đính họa tiết và rách gối theo phong cách đường phố.',
      imageUrl: IMAGE('1541099649105-f69ad21f3246'),
      imageSubject: 'quần jeans nữ đính họa tiết và rách gối',
      basePrice: 390_000,
    },
    {
      title: 'Giày chạy bộ Nike màu đỏ',
      description:
        'Giày chạy bộ Nike thân dệt màu đỏ, đế trắng, kiểu dáng nhẹ và phù hợp tập luyện hằng ngày.',
      imageUrl: IMAGE('1542291026-7eec264c27ff'),
      imageSubject: 'giày chạy bộ Nike màu đỏ',
      basePrice: 1_250_000,
    },
    {
      title: 'Balo laptop tối giản màu xanh đen',
      description:
        'Balo dáng hộp màu xanh đen, ngăn chính rộng và mặt trước tối giản, phù hợp đi học hoặc đi làm.',
      imageUrl: IMAGE('1553062407-98eeb64c6a62'),
      imageSubject: 'balo laptop màu xanh đen',
      basePrice: 620_000,
    },
    {
      title: 'Kính râm gọng đen dáng Wayfarer',
      description:
        'Kính râm gọng nhựa đen dáng Wayfarer cổ điển, tròng tối màu và dễ phối với nhiều phong cách.',
      imageUrl: IMAGE('1572635196237-14b3f281503f'),
      imageSubject: 'kính râm gọng đen dáng Wayfarer',
      basePrice: 890_000,
    },
  ],
  furniture: [
    {
      title: 'Bàn làm việc trắng chân nâng hạ',
      description:
        'Bàn làm việc mặt trắng, chân kim loại có thể điều chỉnh, đủ chỗ cho máy tính và phụ kiện văn phòng.',
      imageUrl: IMAGE('1518455027359-f3f8164ba6bd'),
      imageSubject: 'bàn làm việc trắng với máy tính để bàn',
      basePrice: 2_800_000,
    },
    {
      title: 'Ghế văn phòng da nâu tay vịn chrome',
      description:
        'Ghế văn phòng bọc da nâu, tay vịn và khung kim loại sáng, đệm lưng dày tạo cảm giác chắc chắn.',
      imageUrl: IMAGE('1505797149-43b0069ec26b'),
      imageSubject: 'ghế văn phòng da nâu khung chrome',
      basePrice: 1_900_000,
    },
    {
      title: 'Bộ giường ngủ đôi phong cách hiện đại',
      description:
        'Giường đôi bọc nệm sáng màu kèm ghế cuối giường, phù hợp phòng ngủ hiện đại có diện tích rộng.',
      imageUrl: IMAGE('1540518614846-7eded433c457'),
      imageSubject: 'giường ngủ đôi trong phòng hiện đại',
      basePrice: 5_500_000,
    },
    {
      title: 'Tủ treo tường ba cánh vân gỗ',
      description:
        'Tủ treo tường ba cánh vân gỗ sáng, nhiều ngăn để khăn và đồ dùng, phù hợp phòng tắm hoặc phòng ngủ.',
      imageUrl: IMAGE('1595428774223-ef52624120d2'),
      imageSubject: 'tủ treo tường ba cánh vân gỗ sáng',
      basePrice: 2_600_000,
    },
    {
      title: 'Giường đôi bọc nệm đầu giường',
      description:
        'Giường đôi bọc nệm màu kem với đầu giường chần nút, kiểu dáng sang và dễ phối nội thất.',
      imageUrl: IMAGE('1505693416388-ac5ce068fe85'),
      imageSubject: 'giường đôi bọc nệm màu kem',
      basePrice: 6_200_000,
    },
    {
      title: 'Đèn bàn trắng cổ xoay',
      description:
        'Đèn bàn màu trắng, cổ đèn có thể điều chỉnh hướng chiếu, phù hợp bàn học hoặc góc đọc sách.',
      imageUrl: IMAGE('1533090161767-e6ffed986c88'),
      imageSubject: 'đèn bàn màu trắng trên bàn làm việc',
      basePrice: 350_000,
    },
  ],
  books: [
    {
      title: 'Sách Milk and Honey - Rupi Kaur',
      description:
        'Sách thơ Milk and Honey bản tiếng Anh của Rupi Kaur, bìa mềm màu đen và gáy sách còn nguyên vẹn.',
      imageUrl: IMAGE('1544947950-fa07a98d237f'),
      imageSubject: 'sách Milk and Honey của Rupi Kaur',
      basePrice: 180_000,
    },
    {
      title: 'Bộ sách khởi nghiệp và quản trị tiếng Anh',
      description:
        'Bộ sách tiếng Anh về khởi nghiệp, quản trị và xây dựng doanh nghiệp, gồm nhiều đầu sách thực hành.',
      imageUrl: IMAGE('1512820790803-83ca734da794'),
      imageSubject: 'chồng sách tiếng Anh về khởi nghiệp và quản trị',
      basePrice: 720_000,
    },
  ],
  sports: [
    {
      title: 'Vợt cầu lông dành cho người chơi phong trào',
      description:
        'Vợt cầu lông khung nhẹ, phù hợp tập luyện và thi đấu phong trào trong nhà.',
      imageUrl: IMAGE('1626224583764-f87db24ac4ea'),
      imageSubject: 'người chơi cầu lông trong sân',
      basePrice: 750_000,
    },
    {
      title: 'Thảm tập yoga cuộn nhiều màu',
      description:
        'Thảm tập yoga dạng cuộn, bề mặt chống trượt và có nhiều màu để lựa chọn, phù hợp tập tại nhà.',
      imageUrl: IMAGE('1601925260368-ae2f83cf8b7f'),
      imageSubject: 'nhiều thảm yoga được cuộn lại',
      basePrice: 420_000,
    },
    {
      title: 'Xe đạp fixed gear khung trắng',
      description:
        'Xe đạp fixed gear khung trắng, ghi đông cong và lốp mảnh, phù hợp đi lại trong thành phố.',
      imageUrl: IMAGE('1485965120184-e220f721d03e'),
      imageSubject: 'xe đạp fixed gear khung trắng',
      basePrice: 4_200_000,
    },
    {
      title: 'Xe đạp thành phố khung trắng',
      description:
        'Xe đạp thành phố khung trắng, tư thế ngồi thoải mái và phù hợp đi làm hoặc giao hàng quãng ngắn.',
      imageUrl: IMAGE('1621972750749-0fbb1abb7736'),
      imageSubject: 'người giao hàng đi xe đạp khung trắng',
      basePrice: 3_600_000,
    },
  ],
  vehicles: [
    {
      title: 'Mô tô thể thao Kawasaki màu xanh',
      description:
        'Mô tô thể thao Kawasaki màu xanh đặc trưng, dàn áo liền khối và tư thế lái thể thao.',
      imageUrl: IMAGE('1599819811279-d5ad9cccf838'),
      imageSubject: 'mô tô thể thao Kawasaki màu xanh',
      basePrice: 89_000_000,
    },
    {
      title: 'Mô tô cruiser màu đen',
      description:
        'Mô tô cruiser màu đen với yên thấp và tay lái rộng, phù hợp những chuyến đi đường dài.',
      imageUrl: IMAGE('1558981806-ec527fa84c39'),
      imageSubject: 'người lái mô tô cruiser màu đen',
      basePrice: 72_000_000,
    },
    {
      title: 'Ô tô Porsche màu đen',
      description:
        'Ô tô Porsche bốn cửa màu đen, kiểu dáng thể thao và nội ngoại thất được giữ gìn sạch sẽ.',
      imageUrl: IMAGE('1503376780353-7e6692767b70'),
      imageSubject: 'ô tô Porsche bốn cửa màu đen',
      basePrice: 1_450_000_000,
    },
  ],
  'home-appliances': [
    {
      title: 'Lò nướng điện Black+Decker để bàn',
      description:
        'Lò nướng điện Black+Decker màu đen, cửa kính phía trước và ba núm điều khiển cơ dễ sử dụng.',
      imageUrl: IMAGE('1574269909862-7e1d70bb8078'),
      imageSubject: 'lò nướng điện Black+Decker để bàn',
      basePrice: 1_350_000,
    },
    {
      title: 'Máy trộn bột để bàn màu trắng',
      description:
        'Máy trộn bột để bàn màu trắng kèm tô inox, phù hợp đánh trứng, trộn bột và làm bánh tại nhà.',
      imageUrl: IMAGE('1578643463396-0997cb5328c1'),
      imageSubject: 'máy trộn bột để bàn màu trắng với tô inox',
      basePrice: 3_800_000,
    },
  ],
  toys: [
    {
      title: 'Thùng gạch LEGO rời nhiều màu',
      description:
        'Gạch LEGO rời nhiều màu và kích thước, phù hợp bổ sung chi tiết để bé tự do sáng tạo mô hình.',
      imageUrl: IMAGE('1587654780291-39c9404d746b'),
      imageSubject: 'nhiều gạch LEGO rời đủ màu',
      basePrice: 680_000,
    },
    {
      title: 'Bộ board game chiến thuật xây dựng',
      description:
        'Board game chiến thuật gồm bàn bản đồ, xúc xắc và nhiều quân chơi, phù hợp nhóm bạn hoặc gia đình.',
      imageUrl: IMAGE('1610890716171-6b1bb98ffd09'),
      imageSubject: 'bàn board game chiến thuật với xúc xắc và quân chơi',
      basePrice: 590_000,
    },
  ],
  music: [
    {
      title: 'Đàn guitar acoustic màu gỗ tự nhiên',
      description:
        'Đàn guitar acoustic màu gỗ tự nhiên, cần đàn thẳng và âm thanh ấm, phù hợp người mới tập chơi.',
      imageUrl: IMAGE('1510915361894-db8b60106cb1'),
      imageSubject: 'đàn guitar acoustic màu gỗ tự nhiên',
      basePrice: 1_750_000,
    },
    {
      title: 'Bộ thiết bị phòng thu âm tại nhà',
      description:
        'Bộ thiết bị phòng thu gồm bàn mixer, màn hình điều khiển và hệ thống loa kiểm âm cho góc sáng tác.',
      imageUrl: IMAGE('1598488035139-bdbb2231ce04'),
      imageSubject: 'phòng thu với bàn mixer, màn hình và guitar',
      basePrice: 18_500_000,
    },
  ],
  other: [
    {
      title: 'Bình giữ nhiệt màu xanh lá',
      description:
        'Bình giữ nhiệt dáng trụ màu xanh lá, nắp vặn kín và bề mặt nhám dễ cầm nắm.',
      imageUrl: IMAGE('1602143407151-7111542de6e8'),
      imageSubject: 'bình giữ nhiệt dáng trụ màu xanh lá',
      basePrice: 320_000,
    },
    {
      title: 'Cây Monstera trồng chậu để bàn',
      description:
        'Cây Monstera lá xanh khỏe, trồng trong chậu gốm nhỏ và phù hợp trang trí góc làm việc.',
      imageUrl: IMAGE('1545241047-6083a3684587'),
      imageSubject: 'cây Monstera trong chậu gốm nhỏ',
      basePrice: 280_000,
    },
  ],
};

export const LEGACY_CURATED_TITLES = [
  'iPhone 14 Pro Max 256GB - Màu Tím',
  'Sony WH-1000XM4 Tai Nghe Chống Ồn',
  'Bàn phím cơ Keychron K2 V2 LED RGB',
  'Áo Khoác Denim Vintage Size L',
  'Giày Nike Air Max 90 Trắng Đen',
  'Ghế Ergonomic Sihoo M57 Công Thái Học',
  'Bàn Trà Sofa Mặt Kính Chân Gỗ Sồi',
  'Bộ Sách Clean Code & Clean Architecture',
  'Tiểu Thuyết Harry Potter Trọn Bộ 7 Tập',
  'Vợt Cầu Lông Yonex Astrox 88D Play',
  'Xe Đạp Địa Hình Giant ATX 660 Cỡ S',
  'Xe Máy Honda Wave Alpha 110cc 2019',
  'Nồi Chiên Không Dầu Philips HD9252',
  'Máy Lọc Không Khí Xiaomi 4 Compact',
  'Bộ LEGO Technic Porsche 911 RSR 42096',
  'Đàn Guitar Acoustic Yamaha F310',
] as const;

export const CURATED_PRODUCTS: readonly ProductSeedData[] = [
  {
    title: 'iPhone Pro 256GB màu Graphite',
    description:
      'iPhone dòng Pro dung lượng 256GB, màu graphite đúng như ảnh. Máy dùng được 8 tháng, pin còn 92%, cụm ba camera và thân máy không nứt vỡ; kèm hộp và cáp sạc.',
    price: 21_500_000,
    condition: ProductCondition.LIKE_NEW,
    type: ExchangeType.SELL,
    status: ProductStatus.AVAILABLE,
    categorySlug: 'electronics',
    ownerEmail: 'seller1@example.com',
    images: [IMAGE('1678685888221-cda773a3dcdb')],
    location: { ...LOCATIONS[0] },
  },
  {
    title: 'Tai nghe chụp tai Bluetooth màu đen',
    description:
      'Tai nghe chụp tai không dây màu đen đúng như ảnh, đệm tai lớn và gập gọn. Chống ồn tốt, âm thanh rõ, pin ổn định và có hộp đựng đi kèm.',
    price: 1_600_000,
    condition: ProductCondition.GOOD,
    type: ExchangeType.SELL,
    status: ProductStatus.AVAILABLE,
    categorySlug: 'electronics',
    ownerEmail: 'seller1@example.com',
    images: [IMAGE('1505740420928-5e560c06d30e')],
    location: { ...LOCATIONS[1] },
  },
  {
    title: 'Bàn phím cơ compact LED RGB',
    description:
      'Bàn phím cơ compact màu đen phối hai phím cam đúng như ảnh, có LED RGB và kết nối không dây. Phím dùng giữ gìn, pin tốt, tương thích Mac và Windows.',
    price: 1_200_000,
    condition: ProductCondition.GOOD,
    type: ExchangeType.SELL,
    status: ProductStatus.AVAILABLE,
    categorySlug: 'electronics',
    ownerEmail: 'seller2@example.com',
    images: [IMAGE('1618384887929-16ec33fab9ef')],
    location: { ...LOCATIONS[2] },
  },
  {
    title: 'Combo quần jeans denim vintage',
    description:
      'Combo quần jeans denim nhiều tông xanh đúng như ảnh, chất vải dày và form đứng. Các quần đã qua sử dụng, không rách ngoài chi tiết thiết kế.',
    price: 450_000,
    condition: ProductCondition.FAIR,
    type: ExchangeType.SELL,
    status: ProductStatus.AVAILABLE,
    categorySlug: 'fashion',
    ownerEmail: 'seller2@example.com',
    images: [IMAGE('1576995853123-5a10305d93c0')],
    location: {
      address: 'Quận Tây Hồ, Hà Nội',
      latitude: 21.0601,
      longitude: 105.8083,
    },
  },
  {
    title: 'Giày chạy bộ Nike màu đỏ',
    description:
      'Giày chạy bộ Nike thân dệt màu đỏ và đế trắng đúng như ảnh. Size 42, giày đi êm chân, đế có vết sử dụng nhẹ nhưng tổng thể còn đẹp.',
    price: 950_000,
    condition: ProductCondition.GOOD,
    type: ExchangeType.SELL,
    status: ProductStatus.AVAILABLE,
    categorySlug: 'fashion',
    ownerEmail: 'seller3@example.com',
    images: [IMAGE('1542291026-7eec264c27ff')],
    location: { ...LOCATIONS[5] },
  },
  {
    title: 'Ghế văn phòng da nâu tay vịn chrome',
    description:
      'Ghế văn phòng bọc da nâu, tay vịn và khung chrome đúng như ảnh. Đệm lưng dày, bánh xe xoay tốt và phù hợp ngồi làm việc hằng ngày.',
    price: 1_800_000,
    condition: ProductCondition.GOOD,
    type: ExchangeType.SELL,
    status: ProductStatus.AVAILABLE,
    categorySlug: 'furniture',
    ownerEmail: 'seller3@example.com',
    images: [IMAGE('1505797149-43b0069ec26b')],
    location: {
      address: 'Hải Châu, Đà Nẵng',
      latitude: 16.0588,
      longitude: 108.2111,
    },
  },
  {
    title: 'Đèn bàn trắng cổ xoay',
    description:
      'Đèn bàn màu trắng với cổ đèn có thể điều chỉnh đúng như ảnh. Ánh sáng phù hợp đọc sách và làm việc; dọn nhà nên tặng lại miễn phí cho người cần.',
    price: null,
    condition: ProductCondition.GOOD,
    type: ExchangeType.DONATE,
    status: ProductStatus.AVAILABLE,
    categorySlug: 'furniture',
    ownerEmail: 'seller1@example.com',
    images: [IMAGE('1533090161767-e6ffed986c88')],
    location: {
      address: 'Quận 7, TP. Hồ Chí Minh',
      latitude: 10.734,
      longitude: 106.7218,
    },
  },
  {
    title: 'Sách Milk and Honey - Rupi Kaur',
    description:
      'Sách thơ Milk and Honey bản tiếng Anh của Rupi Kaur, bìa mềm màu đen đúng như ảnh. Sách được giữ sạch, không viết vẽ và không thiếu trang.',
    price: 180_000,
    condition: ProductCondition.LIKE_NEW,
    type: ExchangeType.SELL,
    status: ProductStatus.AVAILABLE,
    categorySlug: 'books',
    ownerEmail: 'seller2@example.com',
    images: [IMAGE('1544947950-fa07a98d237f')],
    location: {
      address: 'Cầu Giấy, Hà Nội',
      latitude: 21.036,
      longitude: 105.782,
    },
  },
  {
    title: 'Bộ sách khởi nghiệp và quản trị tiếng Anh',
    description:
      'Bộ sách tiếng Anh về khởi nghiệp, xây dựng doanh nghiệp và quản trị đúng như ảnh. Các cuốn còn đủ bìa, không rách trang và chỉ ngả màu nhẹ.',
    price: 650_000,
    condition: ProductCondition.GOOD,
    type: ExchangeType.SELL,
    status: ProductStatus.AVAILABLE,
    categorySlug: 'books',
    ownerEmail: 'buyer2@example.com',
    images: [IMAGE('1512820790803-83ca734da794')],
    location: { ...LOCATIONS[3] },
  },
  {
    title: 'Vợt cầu lông dành cho người chơi phong trào',
    description:
      'Vợt cầu lông khung nhẹ, đã căng cước 10,5 kg và phù hợp tập luyện trong nhà như ảnh minh họa. Khung có vài vết xước sơn nhỏ, không nứt lún.',
    price: 700_000,
    condition: ProductCondition.GOOD,
    type: ExchangeType.SELL,
    status: ProductStatus.AVAILABLE,
    categorySlug: 'sports',
    ownerEmail: 'buyer2@example.com',
    images: [IMAGE('1626224583764-f87db24ac4ea')],
    location: {
      address: 'Đống Đa, Hà Nội',
      latitude: 21.02,
      longitude: 105.825,
    },
  },
  {
    title: 'Xe đạp fixed gear khung trắng',
    description:
      'Xe đạp fixed gear khung trắng, ghi đông cong và lốp mảnh đúng như ảnh. Xe vận hành ổn định, cần đổi sang xe thành phố có tư thế ngồi thẳng hơn.',
    price: null,
    condition: ProductCondition.GOOD,
    type: ExchangeType.EXCHANGE,
    status: ProductStatus.AVAILABLE,
    categorySlug: 'sports',
    ownerEmail: 'buyer1@example.com',
    images: [IMAGE('1485965120184-e220f721d03e')],
    location: {
      address: 'Quận 7, TP. Hồ Chí Minh',
      latitude: 10.734,
      longitude: 106.7218,
    },
  },
  {
    title: 'Mô tô cruiser màu đen',
    description:
      'Mô tô cruiser màu đen, yên thấp và tay lái rộng đúng như ảnh. Xe máy móc nguyên bản, chạy êm, đã sử dụng khoảng 28.000 km và có đủ giấy tờ.',
    price: 72_000_000,
    condition: ProductCondition.GOOD,
    type: ExchangeType.SELL,
    status: ProductStatus.AVAILABLE,
    categorySlug: 'vehicles',
    ownerEmail: 'seller1@example.com',
    images: [IMAGE('1558981806-ec527fa84c39')],
    location: { ...LOCATIONS[0] },
  },
  {
    title: 'Lò nướng điện Black+Decker để bàn',
    description:
      'Lò nướng điện Black+Decker màu đen, cửa kính và ba núm điều khiển cơ đúng như ảnh. Khoang lò sạch, các chế độ nhiệt hoạt động ổn định và dễ vệ sinh.',
    price: 1_100_000,
    condition: ProductCondition.LIKE_NEW,
    type: ExchangeType.SELL,
    status: ProductStatus.AVAILABLE,
    categorySlug: 'home-appliances',
    ownerEmail: 'seller2@example.com',
    images: [IMAGE('1574269909862-7e1d70bb8078')],
    location: { ...LOCATIONS[2] },
  },
  {
    title: 'Máy trộn bột để bàn màu trắng',
    description:
      'Máy trộn bột để bàn màu trắng với tô inox đúng như ảnh. Máy chạy ổn định, phù hợp đánh trứng và trộn bột làm bánh; mới dùng khoảng ba tháng.',
    price: 3_600_000,
    condition: ProductCondition.LIKE_NEW,
    type: ExchangeType.SELL,
    status: ProductStatus.AVAILABLE,
    categorySlug: 'home-appliances',
    ownerEmail: 'buyer2@example.com',
    images: [IMAGE('1578643463396-0997cb5328c1')],
    location: { ...LOCATIONS[3] },
  },
  {
    title: 'Thùng gạch LEGO rời nhiều màu',
    description:
      'Thùng gạch LEGO rời nhiều màu và kích thước đúng như ảnh, đã vệ sinh sạch và không lẫn đồ chơi khác. Phù hợp bổ sung chi tiết cho các bộ mô hình.',
    price: 680_000,
    condition: ProductCondition.LIKE_NEW,
    type: ExchangeType.SELL,
    status: ProductStatus.AVAILABLE,
    categorySlug: 'toys',
    ownerEmail: 'buyer3@example.com',
    images: [IMAGE('1587654780291-39c9404d746b')],
    location: { ...LOCATIONS[4] },
  },
  {
    title: 'Đàn guitar acoustic màu gỗ tự nhiên',
    description:
      'Đàn guitar acoustic màu gỗ tự nhiên đúng như ảnh, cần đàn thẳng và âm thanh ấm. Mặt sau có xước dăm nhẹ, không ảnh hưởng âm thanh; tặng kèm bao da.',
    price: 1_400_000,
    condition: ProductCondition.GOOD,
    type: ExchangeType.SELL,
    status: ProductStatus.AVAILABLE,
    categorySlug: 'music',
    ownerEmail: 'seller3@example.com',
    images: [IMAGE('1510915361894-db8b60106cb1')],
    location: { ...LOCATIONS[5] },
  },
];

const deterministicOffset = (index: number, salt: number) =>
  (((index * salt) % 41) - 20) / 1000;

const deterministicPrice = (basePrice: number, index: number) => {
  const percent = 90 + ((index * 17) % 21);
  return Math.max(
    10_000,
    Math.round((basePrice * percent) / 100 / 10_000) * 10_000,
  );
};

export function buildGeneratedProducts(): ProductSeedData[] {
  return Array.from(
    { length: GENERATED_PRODUCT_COUNT },
    (_, generatedIndex) => {
      const displayIndex = generatedIndex + 1;
      const categorySlug =
        CATEGORY_SLUGS[generatedIndex % CATEGORY_SLUGS.length];
      const categoryRound = Math.floor(generatedIndex / CATEGORY_SLUGS.length);
      const templates = PRODUCT_TEMPLATES[categorySlug];
      const template = templates[categoryRound % templates.length];
      const condition = CONDITIONS[generatedIndex % CONDITIONS.length];
      const type =
        displayIndex % 11 === 0
          ? ExchangeType.DONATE
          : displayIndex % 3 === 0
            ? ExchangeType.EXCHANGE
            : ExchangeType.SELL;
      const location = LOCATIONS[(generatedIndex * 7) % LOCATIONS.length];
      const price =
        type === ExchangeType.DONATE
          ? null
          : deterministicPrice(template.basePrice, displayIndex);

      return {
        title: `${template.title} #${String(displayIndex).padStart(3, '0')}`,
        description: `${template.description} ${CONDITION_NOTES[condition]} ${TYPE_NOTES[type]}`,
        price,
        condition,
        type,
        status: ProductStatus.AVAILABLE,
        categorySlug,
        ownerEmail: OWNER_EMAILS[generatedIndex % OWNER_EMAILS.length],
        images: [template.imageUrl],
        location: {
          address: location.address,
          latitude: Number(
            (location.latitude + deterministicOffset(displayIndex, 17)).toFixed(
              6,
            ),
          ),
          longitude: Number(
            (
              location.longitude + deterministicOffset(displayIndex, 29)
            ).toFixed(6),
          ),
        },
      };
    },
  );
}

export function validateProductSeedData(products: readonly ProductSeedData[]) {
  const expectedCount = CURATED_PRODUCTS.length + GENERATED_PRODUCT_COUNT;
  const deadImageIds = [
    '1508098682722-e99c43a406b2',
    '1508186227448-7a6cf6f82188',
    '1591808381878-bfbb18b671a4',
    '1618949823023-ec9cf281a8f0',
  ];
  const titles = new Set<string>();

  if (products.length !== expectedCount) {
    throw new Error(
      `Product catalog has ${products.length} records; expected ${expectedCount}.`,
    );
  }

  products.forEach((product, index) => {
    if (!product.title.trim() || !product.description.trim()) {
      throw new Error(
        `Product at index ${index} is missing title or description.`,
      );
    }

    if (titles.has(product.title)) {
      throw new Error(`Duplicate product title: ${product.title}`);
    }
    titles.add(product.title);

    if (product.images.length !== 1) {
      throw new Error(
        `Product "${product.title}" must have exactly one image.`,
      );
    }

    const [imageUrl] = product.images;
    if (!imageUrl.startsWith('https://images.unsplash.com/')) {
      throw new Error(
        `Product "${product.title}" has an unsupported image URL.`,
      );
    }

    if (deadImageIds.some((photoId) => imageUrl.includes(photoId))) {
      throw new Error(
        `Product "${product.title}" uses a known dead image URL.`,
      );
    }
  });
}

export function buildProductSeedData(): ProductSeedData[] {
  const products = [
    ...CURATED_PRODUCTS.map((product) => ({
      ...product,
      images: [...product.images],
      location: { ...product.location },
    })),
    ...buildGeneratedProducts(),
  ];

  validateProductSeedData(products);
  return products;
}
