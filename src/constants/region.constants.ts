import { Location } from '../interfaces/region.interface';

export const REGIONS: Location.RegionLocation[] = [
	{
		fullName: 'Autonomous Region in Muslim Mindanao',
		shortName: 'ARMM',
		location: { type: 'Point', coordinates: [0, 0] },
		cities: [
			{
				name: 'Lamitan City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Marawi City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
		],
	},
	{
		fullName: 'Cordillera Administrative Region',
		shortName: 'CAR',
		location: { type: 'Point', coordinates: [0, 0] },
		cities: [
			{
				name: 'Baguio City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Tabuk City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
		],
	},
	{
		fullName: 'National Capital Region',
		shortName: 'NCR',
		location: { type: 'Point', coordinates: [0, 0] },
		cities: [
			{
				name: 'Caloocan City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Las Piñas City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Makati City',
				location: { type: 'Point', coordinates: [0, 0] },
				subTitle: 'Financial Capital of the Philippines',
				isFeatured: true,
				mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7721.311994577134!2d121.05278739772628!3d14.618662090494729!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b7eadd63a1df%3A0xa6f6a02c480fc32c!2sCubao%2C%20Quezon%20City%2C%20Metro%20Manila%2C%20Philippines!5e0!3m2!1sen!2sin!4v1573475159116!5m2!1sen!2sin',
				description: 'Makati is the financial center of the Philippines; it has the highest concentration of multinational and local corporations in the country. Major banks, corporations, department stores as well as foreign embassies are based in Makati. The biggest trading floor of the Philippine Stock Exchange is situated along the city’s Ayala Avenue. Makati is also known for being a major cultural and entertainment hub in Metro Manila.\n\nMakati is located within the circle of 14′40″ °north and 121′3″ °E right at the center of Metro Manila. The city is bounded on the north by the Pasig River, facing Mandaluyong, on the northeast by Pasig, on the southeast by the municipality of Pateros and Taguig, on the northwest by the city of Manila, and on the southwest by Pasay. Makati has a total land area of 27.36 square kilometres (10.56 sq mi).',
				images: [],
				directory: {
					medical: [
						{
							name: 'Makati Medical Center',
							address: '2 Amorsolo Street, Legazpi Village, Makati, 1229 Kalakhang Maynila, Philippines',
							email: 'https://www.makatimed.net.ph/about-mmc/about-us',
							website: 'makatimed.net.ph',
							telephone: '+63 (02) 8888 8999',
							locationUrl: 'https://goo.gl/maps/hjjEN73FdPTSY6vY8',
							imageUrl: 'https://lh5.googleusercontent.com/p/AF1QipMZN_henr87ge-W2D9QXVYXIw-KUSXFep3xBbiA=w408-h544-k-no',
						},
						{
							name: 'OSPITAL NG MAKATI',
							address: 'Sampaguita St, Makati, 1218 Metro Manila',
							email: 'ospitalngmakati@yahoo.com',
							website: 'http://www.makati.gov.ph/portal/organizational_chart/pdf/OSPITAL%20NG%20MAKATI.pdf',
							telephone: '+63 (02) 882 6316,  2 524 6061',
							locationUrl: 'https://goo.gl/maps/MAKgmFdShZ6H8tQf9',
							imageUrl: 'https://lh5.googleusercontent.com/p/AF1QipMK2ta5LGe7O_snBpkd5bnKVxLOqS0FHqIZ3NQy=w408-h544-k-no',
						},
						{
							name: 'MARIA LOURDES MATERNITY HOSPITAL',
							address: '1076 Don Chino Roces Avenue, Makati, Kalakhang Maynila',
							email: 'ospitalngmakati@yahoo.com',
							website: 'https://www.practo.com/makati/clinic/maria-lourdes-maternity-hospital-makati-city-1',
							telephone: '+63 (02) 895 3846',
							locationUrl: 'https://goo.gl/maps/SygAkLJqdKDpdfMZA',
							imageUrl: 'https://geo1.ggpht.com/cbk?panoid=I-Z5Sfpiuyx3hA5eQ624iw&output=thumbnail&cb_client=search.gws-prod.gps&thumb=2&w=408&h=240&yaw=303.66132&pitch=0&thumbfov=100',
						},
						{
							name: 'ST. CLARE’S MEDICAL CENTER',
							address: '1838 Dian St, corner Boyle Street, Makati, 1235 Metro Manila',
							email: 'scmcmktg@yahoo.com',
							website: 'https://stclares.ph',
							telephone: '+63 (02) 831 6511',
							locationUrl: 'https://goo.gl/maps/fimPoHPYwZynAiKg8',
							imageUrl: 'https://lh5.googleusercontent.com/p/AF1QipMHxHwB05uAK0Uamb6mmDshWilA9pYdhGuD5waz=w408-h306-k-no',
						},
						{
							name: 'HEALTHWAY MEDICAL ',
							address: '1 Greenbelt Dr, Legazpi Village, Makati, Metro Manila',
							email: 'customer_service@healthway.com.ph',
							website: 'https://healthway.com.ph/',
							telephone: '+63 (02) 720 6109',
							locationUrl: 'https://goo.gl/maps/x2RnjsL9av5sjUfF6',
							imageUrl: 'https://lh5.googleusercontent.com/p/AF1QipOsQfqibHipgT9PKL0aQ0UcK4IbakheaWZoyJPX=w408-h306-k-no',
						},
					],
					shopping: [
						{
							name: 'POWER PLANT MALL',
							address: 'Rockwell Drive, Estrella, Makati, 1210 Metro Manila',
							email: '',
							website: 'https://www.powerplantmall.com/',
							telephone: '+63 (02) 898 1702',
							locationUrl: 'https://goo.gl/maps/ZoS12UoXejSWpny2A',
							imageUrl: 'https://lh5.googleusercontent.com/p/AF1QipOeXu4cBuvmhqnTfO3iMcvlVIBZIi5N_WVvAyaM=w408-h544-k-no',
						},
						{
							name: 'GREENBELT MALL',
							address: 'Greenbelt Drive, Legazpi Street, Makati, 1223',
							email: '',
							website: 'https://www.ayalaland.com.ph/mall/glorietta/',
							telephone: '+63 (02) 757 4853',
							locationUrl: 'https://goo.gl/maps/w3xzzKGxRSERGUnaA',
							imageUrl: 'https://lh5.googleusercontent.com/p/AF1QipMdwzO_A3f8FGaxDStSMgN7VvAHCZKyGfKz_oac=w408-h306-k-no',
						},
						{
							name: 'GLORIETTA',
							address: 'Ayala Center, 6811 Ayala Ave, Makati, 1226 Metro Manila',
							email: '',
							website: 'https://www.ayalaland.com.ph/mall/glorietta/',
							telephone: '+63 (02) 752 7272',
							locationUrl: 'https://goo.gl/maps/revhVL9aGw91LEtPA',
							imageUrl: 'https://lh5.googleusercontent.com/p/AF1QipP2_f6gB8UT4XyoQ8MZcDn0RrYB5G3vAK46ZJN0=w426-h240-k-no',
						},
						{
							name: 'SM AYALA',
							address: 'SM Makati, EDSA, Makati, 1224 Metro Manila',
							email: '',
							website: 'https://www.smsupermalls.com/',
							telephone: '+63 (02) 811 0000',
							locationUrl: 'https://goo.gl/maps/XHXwyfUdU2Ph1Y4A9',
							imageUrl: 'https://geo1.ggpht.com/cbk?panoid=uVds7GX0KFmnD9o4ZA-v6A&output=thumbnail&cb_client=search.gws-prod.gps&thumb=2&w=408&h=240&yaw=274.79013&pitch=0&thumbfov=100',
						},
						{
							name: 'THE LANDMARK MAKATI',
							address: '6751 Makati Ave, Ayala Center, Makati, Metro Manila',
							email: '',
							website: 'https://www.landmark.com.ph/',
							telephone: '+63  (02) 810 9990',
							locationUrl: 'https://goo.gl/maps/G9qrjiSvHoKsNcUk9',
							imageUrl: 'https://lh5.googleusercontent.com/p/AF1QipM-vWVVF9rUBzc6Pnd-xHuCrkxVOXyTsCje4r6V=w408-h544-k-no',
						},
					],
					others: [
						{
							name: 'ROYAL CLUB MAKATI',
							address: '5343 St., General Luna, Makati, 1210 Metro Manila',
							email: 'royalclubmakati@gmail.com',
							website: 'https://www.facebook.com/clubroyalmakati/',
							telephone: '+63 (02) 831 0184',
							locationUrl: 'https://goo.gl/maps/o8dKdUCBZfhR9M867',
							imageUrl: 'https://lh5.googleusercontent.com/p/AF1QipOudnVB4EmW1yef1WFimv5PARaD-HYSvOcp5gAQ=w408-h271-k-no',
						},
						{
							name: 'BUDDHA BAR MANILA',
							address: 'PICAR Place, Kalayaan Ave, Makati, Metro Manila',
							email: 'info@buddhabarmanila.com',
							website: 'http://buddhabarmanila.com/',
							telephone: '+63 (02) 856 6859, (02) 856 6719',
							locationUrl: 'https://goo.gl/maps/mQLNcdbnLzJSUCui8',
							imageUrl: 'https://lh5.googleusercontent.com/p/AF1QipNungUOZcbwuq_rRM-oo6tN0qzpodxSazQd7FSm=w408-h306-k-no',
						},
						{
							name: 'STRUMM’S',
							address: '110 Jupiter, Makati, 1209 Metro Manila',
							email: 'info@strumms.com',
							website: 'https://www.strumms.com/',
							telephone: '+63 (02) 895 4636',
							locationUrl: 'https://goo.gl/maps/dYVKCtXLeG9ULLzd9',
							imageUrl: 'https://lh5.googleusercontent.com/p/AF1QipP-tetq6m88cFiH673Gyfw-szkG-lyQO-HRza5M=w408-h306-k-no',
						},
						{
							name: 'THE PENTHOUSE 8747',
							address: '1209, 8747 Paseo de Roxas, Makati, 1227',
							email: 'vanessa@paseopenthouse.com',
							website: 'http://www.paseopenthouse.com/',
							telephone: ' +63917 801 0655',
							locationUrl: 'https://goo.gl/maps/EGUYt8XtC7MmzRYCA',
							imageUrl: 'https://lh5.googleusercontent.com/p/AF1QipMSI_aZgt717YD8isA64qqVoT3zZliZ_4Oj3MOM=w408-h408-k-no'
						},
						{
							name: 'LONG BAR',
							address: '1 Raffles Drive Makati Avenue Corner Makati, 1224 Metro Manila',
							email: 'dining.makati@raffles.com',
							website: 'http://www.raffles.com/makati/dining/long-bar/',
							telephone: '+63  (02) 555 9888',
							locationUrl: 'https://goo.gl/maps/yrFT4YU4GAQxcaDD8',
							imageUrl: 'https://lh5.googleusercontent.com/p/AF1QipN4zHrm1sNN6weFgKmiWZHP2TZpyJ9Wviv9RRSg=w408-h306-k-no',
						},
					],
				},
			},
			{
				name: 'Malabon City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Mandaluyong City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Manila City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Marikina City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Muntinlupa City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Navotas City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Parañaque City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Pasay City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Pasig City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Quezon City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'San Juan City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Taguig City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Valenzuela City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
		],
	},
	{
		fullName: 'Ilocos Region',
		shortName: 'Region 1',
		location: { type: 'Point', coordinates: [0, 0] },
		cities: [
			{
				name: 'Batac City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Laoag City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Candon City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Vigan City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'San Fernando City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Alaminos City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Dagupan City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'San Carlos City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Urdaneta City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
		],
	},
	{
		fullName: 'Cagayan Valley',
		shortName: 'Region 2',
		location: { type: 'Point', coordinates: [0, 0] },
		cities: [
			{
				name: 'Tuguegarao City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Cauayan City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Ilagan City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Santiago City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
		],
	},
	{
		fullName: 'Central Luzon',
		shortName: 'Region 3',
		location: { type: 'Point', coordinates: [0, 0] },
		cities: [
			{
				name: 'Balanga City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Malolos City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Meycauayan City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'San Jose del Monte City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Cabanatuan City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Gapan City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Muñoz City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Palayan City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Angeles City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Mabalacat City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'San Fernando City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Tarlac City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Olongapo City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'San Jose City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
		],
	},
	{
		fullName: 'CALABARZON',
		shortName: 'Region 4A',
		location: { type: 'Point', coordinates: [0, 0] },
		cities: [
			{
				name: 'Batangas City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Lipa City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Tanauan City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Bacoor City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Cavite City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Dasmariñas City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Imus City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Tagaytay City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Trece Martires City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Biñan City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Cabuyao City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'San Pablo City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Santa Rosa City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Lucena City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Tayabas City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Antipolo City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Calamba City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
		],
	},
	{
		fullName: 'MIMAROPA',
		shortName: 'Region 4B',
		location: { type: 'Point', coordinates: [0, 0] },
		cities: [
			{
				name: 'Calapan City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Puerto Princesa City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
		],
	},
	{
		fullName: 'Bicol',
		shortName: 'Region 5',
		location: { type: 'Point', coordinates: [0, 0] },
		cities: [
			{
				name: 'Legazpi City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Ligao City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Tabaco City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Iriga City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Naga City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Masbate City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Sorsogon City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
		],
	},
	{
		fullName: 'Western Visayas',
		shortName: 'Region 6',
		location: { type: 'Point', coordinates: [0, 0] },
		cities: [
			{
				name: 'Roxas City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Iloilo City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Passi City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Bacolod City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Bago City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Cadiz City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Escalante City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Himamaylan City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Kabankalan City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'La Carlota City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Sagay City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'San Carlos City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Silay City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Sipalay City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Talisay City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Victorias City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
		],
	},
	{
		fullName: 'Central Visayas',
		shortName: 'Region 7',
		location: { type: 'Point', coordinates: [0, 0] },
		cities: [
			{
				name: 'Tagbilaran City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Bogo City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Carcar City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Cebu City',
				location: { type: 'Point', coordinates: [0, 0] },
					subTitle: 'FQueen City of the South',
					isFeatured: true,
					mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125585.15595432151!2d123.77608292271593!3d10.37892568466247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a999258dcd2dfd%3A0x4c34030cdbd33507!2sCebu%20City%2C%20Cebu%2C%20Philippines!5e0!3m2!1sen!2sin!4v1573544727146!5m2!1sen!2sin',
					description: 'Located in the middle of the eastern side of Cebu Island, it is the center of a metropolitan area called Metro Cebu which also includes the cities of Carcar, Danao, Lapu-Lapu, Mandaue, Naga and Talisay; and the municipalities (towns) of Compostela, Consolacion, Cordova, Liloan, Minglanilla and San Fernando. Metro Cebu had a total population of 2,849,213 as of 2015, making it the second-most populous metropolitan area of the nation, after Metro Manila in Luzon. Cebu is bounded on the north by the town of Balamban and the city of Danao, on the west by the city of Toledo, on the east by the cities of Lapu-Lapu and Mandaue and the towns of Liloan, Consolacion and Compostela, and on the south by the city of Talisay.',
					directory: {
						medical: [
							{
								name: 'CEBU CITY MEDICAL CENTER',
								address: 'Natalio B. Bacalso Ave, Cebu City, 6000 Cebu',
								email: '',
								website: 'https://www.facebook.com/cebucitymedicalcenterofficial/',
								telephone: '+63 (02) 32 516 3934,(02) 32 512 4622',
								locationUrl: 'https://goo.gl/maps/YxMzSncQ52wwLkUN8',
								imageUrl: 'https://lh5.googleusercontent.com/p/AF1QipMYHnEP0hASDSeLSJ49Sjdi_jMG8CIMQpSTF-P_=w426-h240-k-no'
							},
							{
								name: 'CHONG HUA HOSPITAL',
								address: 'Fuente Osmeña, Don Mariano Cui St, Cebu City, 6000 Cebu',
								email: 'customerservice@chonghua.com.ph',
								website: 'http://www.chonghuahospital.org/',
								telephone: '+63 (02) 882 6316, (02) 524 6061',
								locationUrl: 'https://goo.gl/maps/GVBuze745tumzwAs5',
								imageUrl: 'https://lh5.googleusercontent.com/p/AF1QipPN9Tx13Yhs27MjDMmkxBPmR_Bg23AvqZT-w50t=w408-h306-k-no'
							},
							{
								name: 'PERPETUAL SUCCOUR HOSPITAL',
								address: 'Gorordo Avenue, Lahug, Cebu City, 6000 Cebu',
								email: 'pshcares@perpetualsuccourcebu.com',
								website: 'https://www.perpetualsuccourcebu.com/',
								telephone: '+63 32 233 8620 – 39',
								locationUrl: 'https://goo.gl/maps/NiAmuSrS3QRuoLox6',
								imageUrl: 'https://lh5.googleusercontent.com/p/AF1QipPdfyK4M5plVowfQL1HSLThrK6ym_v35k4IDWyY=w408-h306-k-no'
							},
							{
								name: 'CEBU DOCTORS’ UNIVERSITY HOSPITAL',
								address: 'Osmena Boulevard, Capitol Site, Cebu City 6000 Cebu',
								email: 'cduwebmarketing2018@gmail.com',
								website: 'http://cebudoctorsuniversity.edu/',
								telephone: '+63 32 255 5555',
								locationUrl: 'https://goo.gl/maps/mVgWXHNSbNDTZWPt8',
								imageUrl: 'https://lh5.googleusercontent.com/p/AF1QipMCFrj3CWznQhSX1MfCKPNBzOA1DKEI_yw6V3lk=w408-h271-k-no'
							},
							{
								name: 'VICENTE SOTTO MEMORIAL MEDICAL CENTER',
								address: 'B. Rodriguez St, Sambag II, Cebu City, Cebu',
								email: '',
								website: 'http://vsmmc.doh.gov.ph/',
								telephone: '+63 32 253 9891',
								locationUrl: 'https://goo.gl/maps/jj7TGZuXxJbN64oAA',
								imageUrl: 'https://lh5.googleusercontent.com/p/AF1QipN_KPem-FtmrPPdoSTt6nzJYPA-6nJcfw6enoq3=w426-h240-k-no'
							}
						],
						shopping: [
							{
								name: 'SM CITY CEBU',
								address: 'Juan Luna Avenue, North Reclamation Area, Cebu City, Cebu',
								email: '',
								website: 'https://www.smsupermalls.com/mall-locator/sm-city-cebu/information/',
								telephone: '+63 (032) 231 0557',
								locationUrl: 'https://goo.gl/maps/fpCiwaCfBy6kiWF77',
								imageUrl: 'https://lh5.googleusercontent.com/p/AF1QipM1NHwsS-HLc0b7ISc-Ct6zTjRn5aFJ84bPg1Mf=w408-h306-k-no'
							},
							{
								name: 'AYALA CENTER CEBU',
								address: 'Cardinal Rosales Ave, Cebu City, Cebu',
								email: '',
								website: 'http://www.ayalamalls.com.ph/malls-philippines/ayala-center-cebu/',
								telephone: '+63 (032) 888 3777',
								locationUrl: 'https://goo.gl/maps/6Tzh5jTNGRTaPyDW9',
								imageUrl: 'https://lh5.googleusercontent.com/p/AF1QipOrDmh8ImlZ8-iR_b_ROKdCtwDGNkmuZdQt3SCU=w408-h306-k-no'
							},
							{
								name: 'SM SEASIDE CITY CEBU',
								address: 'South Road Properties, Cebu City, 6000 Cebu',
								email: '',
								website: 'https://www.smsupermalls.com/mall-locator/sm-seaside-city-cebu/information/',
								telephone: '+63 (032) 340 8756',
								locationUrl: 'https://g.page/sm-seaside-city-cebu?share',
								imageUrl: 'https://lh5.googleusercontent.com/p/AF1QipOGIlakf4QnuT8T2I-654-ZC7_uR-GSiwXzdhda=w408-h306-k-no'
							},
							{
								name: 'METRO GAISANO COLON',
								address: '179 Osmena Boulevard Juan Luna St, Cebu City, Cebu',
								email: '',
								website: 'http://www.metro.com.ph/',
								telephone: '+63 (032) 416 8793',
								locationUrl: 'https://goo.gl/maps/iVnAnjhwh95bipkw7',
								imageUrl: 'https://lh5.googleusercontent.com/p/AF1QipMmZZYSSHuIyZsW9ievj7fECzgCf5WYUFonIwgt=w408-h725-k-no'
							},
							{
								name: 'GAISANO COUNTRY MALL',
								address: 'Banilad Rd, Apas, Cebu City, 6000 Cebu',
								email: '',
								website: 'https://gaisanocountrymall.business.site/',
								telephone: '+63 (032) 231 1481',
								locationUrl: 'https://goo.gl/maps/iNFpba6zaGjxmR338',
								imageUrl: 'https://lh5.googleusercontent.com/p/AF1QipOhvevKsWbclu8gbG4lt82rhWXSbjXxV_l5fzWQ=w426-h240-k-no'
							},
							{
								name: 'J CENTRE MALL',
								address: '165 A. S. Fortuna St, Mandaue City, 6014 Cebu',
								email: 'marketing@jcentrecebu.com',
								website: 'http://jcentrecebu.com/',
								telephone: '+63 (032) 266 8888',
								locationUrl: 'https://goo.gl/maps/Nn4TVeVEzAMJqpeE9',
								imageUrl: 'https://lh5.googleusercontent.com/p/AF1QipPu7zznU_eetNnKuJlBsrDQwR0FAmwitc-5sRiZ=w408-h306-k-no'
							}
						],
						others: [
							{
								name: 'JESUIT HOUSE MUSEUM',
								address: '26 Zulueta St, Cebu City, 6000 Cebu',
								email: 'http://mailto/',
								website: 'https://www.facebook.com/1730JesuitHouse/',
								telephone: '+63 (032) 255 5408',
								locationUrl: 'https://goo.gl/maps/SbExsnfPfJB8fDyR8',
								imageUrl: 'https://lh5.googleusercontent.com/p/AF1QipNY18frWZ4qQaBwLMcOSSDu5fNe5ohTlAQCNIQK=w408-h306-k-no',
							},
							{
								name: 'CARMELITE MONASTERY',
								address: 'S. Jose de la Montaña St., Mabolo, Cebu City',
								email: 'http://mailto/',
								website: 'https://www.cebucity.gov.ph/4-about-cebu/government/128-carmelite-monastery',
								telephone: '+63 (032) 231-5931, (032) 232-1933',
								locationUrl: 'https://goo.gl/maps/PULdXSfG3xxBR6kt8',
								imageUrl: 'https://lh5.googleusercontent.com/p/AF1QipPaqa72pwQMsUCJFeOjx7irOZWRNH8OwPAp1I0=w408-h544-k-no',
							},
							{
								name: 'SKY EXPERIENCE ADVENTURE',
								address: 'Tower 1, Crown Regency Hotel and Towers, Osmeña Blvd., Cebu City, 6000',
								email: 'http://mailto/',
								website: 'http://www.skyexperienceadventure.com/',
								telephone: '+63 (032) 418 – 8888, (032) 418 7777',
								locationUrl: 'https://goo.gl/maps/UikoRakUVnG1sHVR8',
								imageUrl: 'https://lh5.googleusercontent.com/p/AF1QipONJyOFn6GG0OSFVr6WoYNDACXS_oQ8Oyu7UXKR=w408-h306-k-no',
							},
							{
								name: 'TEMPLE OF LEAH ',
								address: 'Cebu Transcentral Hwy, Cebu City, Cebu',
								email: 'http://mailto/',
								website: '',
								telephone: '+63 906 324 5687',
								locationUrl: 'https://goo.gl/maps/23XMtZzzYCnkydaR6',
								imageUrl: 'https://lh5.googleusercontent.com/p/AF1QipNVgMUFFRhWs6xHQkcKnoUJEV0YtfFuP5OvOHeT=w690-h240-k-no',
							},
							{
								name: 'MAGELLAN’S CROSS',
								address: 'P. Burgos St, Cebu City, Cebu',
								email: '',
								website: '',
								telephone: '',
								locationUrl: '',
								imageUrl: '',
							},
							{
								name: 'CEBU PROVINCIAL MUSEUM',
								address: '731 M. J. Cuenco Ave, Cebu City, 6000 Cebu',
								email: '',
								website: 'https://www.facebook.com/angmuseosugbo',
								telephone: '+63 (032) 239 5626',
								locationUrl: '',
								imageUrl: '  ',
							},
						],
					}
			},
			{
				name: 'Danao City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Lapu-Lapu City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Mandaue City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Naga City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Talisay City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Bais City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Bayawan City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Canlaon City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Dumaguete City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Guihulngan City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Tanjay City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
		],
	},
	{
		fullName: 'Eastern Visayas',
		shortName: 'Region 8',
		location: { type: 'Point', coordinates: [0, 0] },
		cities: [
			{
				name: 'Borongan City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Baybay City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Ormoc City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Tacloban City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Calbayog City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Catbalogan City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Maasin City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
		],
	},
	{
		fullName: 'Zamboanga Peninsula',
		shortName: 'Region 9',
		location: { type: 'Point', coordinates: [0, 0] },
		cities: [
			{
				name: 'Isabela City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Dapitan City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Dipolog City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Pagadian City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Zamboanga City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
		],
	},
	{
		fullName: 'Northern Mindanao',
		shortName: 'Region 10',
		location: { type: 'Point', coordinates: [0, 0] },
		cities: [
			{
				name: 'Malaybalay City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Valencia City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Iligan City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Oroquieta City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Ozamiz City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Tangub City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Cagayan de Oro City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'El Salvador City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Gingoog City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
		],
	},
	{
		fullName: 'Davao Region',
		shortName: 'Region 11',
		location: { type: 'Point', coordinates: [0, 0] },
		cities: [
			{
				name: 'Panabo City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Samal City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Tagum City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Davao City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Digos City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Mati City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
		],
	},
	{
		fullName: 'SOCCSKSARGEN',
		shortName: 'Region 12',
		location: { type: 'Point', coordinates: [0, 0] },
		cities: [
			{
				name: 'Kidapawan City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Cotabato City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'General Santos City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Koronadal City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Tacurong City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
		],
	},
	{
		fullName: 'Caraga Region',
		shortName: 'Region 13',
		location: { type: 'Point', coordinates: [0, 0] },
		cities: [
			{
				name: 'Butuan City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Cabadbaran City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Bayugan City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Surigao City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Bislig City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
			{
				name: 'Tandag City',
				location: { type: 'Point', coordinates: [0, 0] },
			},
		],
	},
];
