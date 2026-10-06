import { db, pool } from '../config/db.js';
import { hashPassword } from '../utils/auth.js';

export const runSeed = async () => {
  console.log('--- Seeding Database with Initial Development Data ---');

  try {
    // 1. Seed Admin User
    const adminPasswordHash = await hashPassword('AdminPassword@2026');
    await db.query(
      `
      INSERT INTO users (name, email, password_hash, role, is_active)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO UPDATE SET 
        password_hash = EXCLUDED.password_hash,
        role = EXCLUDED.role,
        is_active = EXCLUDED.is_active;
    `,
      ['Sree Hari Admin', 'admin@sreeharirealty.com', adminPasswordHash, 'ADMIN', true]
    );
    console.log('✅ Admin user created: admin@sreeharirealty.com / AdminPassword@2026');

    // 2. Seed Master Amenities
    const amenities = [
      { name: 'Gated Community with 24/7 Security', icon: 'ShieldCheck', category: 'SECURITY' },
      { name: 'Grand Arch Entrance & CCTV', icon: 'DoorOpen', category: 'SECURITY' },
      { name: '30 & 40 Feet Blacktop Roads', icon: 'Road', category: 'INFRASTRUCTURE' },
      { name: 'Solar Street Lights', icon: 'Sun', category: 'INFRASTRUCTURE' },
      { name: 'Avenue Plantation & Landscaped Parks', icon: 'Trees', category: 'ENVIRONMENT' },
      { name: 'Sweet Potable Ground Water', icon: 'Droplet', category: 'UTILITIES' },
      { name: 'Rainwater Harvesting System', icon: 'CloudRain', category: 'UTILITIES' },
      { name: 'Underground Drainage & Electricity', icon: 'Zap', category: 'UTILITIES' },
      { name: 'Children Play Area & Walking Track', icon: 'Smile', category: 'LIFESTYLE' },
      { name: '100% Clear Title & Immediate Registration', icon: 'FileCheck', category: 'LEGAL' },
      { name: 'DTCP & RERA Approved Layout', icon: 'Award', category: 'LEGAL' },
      { name: 'Compound Wall for Entire Layout', icon: 'Layers', category: 'SECURITY' },
    ];

    for (const amenity of amenities) {
      await db.query(
        `
        INSERT INTO amenities (name, icon, category)
        VALUES ($1, $2, $3)
        ON CONFLICT (name) DO UPDATE SET icon = EXCLUDED.icon, category = EXCLUDED.category;
      `,
        [amenity.name, amenity.icon, amenity.category]
      );
    }
    console.log(`✅ ${amenities.length} Amenities seeded.`);

    // 3. Seed Gated Community Plot Projects
    const projects = [
      {
        name: 'Sri Hari Green Enclave',
        slug: 'sri-hari-green-enclave',
        tagline: 'Premium CMDA & RERA Approved Residential Villa Plots at Tambaram West',
        description:
          'Sri Hari Green Enclave is an exclusive 12-acre gated community featuring 140 well-planned residential plots surrounded by lush greenery. Designed for peace of mind and rapid appreciation, the project boasts wide 40ft blacktop tar roads, avenue trees, 24/7 security guard post, solar lighting, and immediate DTCP/RERA approvals ready for home construction.',
        location: 'Tambaram West, Chennai',
        address: 'Near 400ft Outer Ring Road Junction, Tambaram West, Chennai, Tamil Nadu - 600045',
        city: 'Chennai',
        state: 'Tamil Nadu',
        total_area: '12 Acres',
        total_units: '140 Plots',
        price_range: '₹32 Lakhs - ₹78 Lakhs',
        price_per_sqft: 3200,
        status: 'ONGOING',
        is_featured: true,
        is_visible: true,
        main_image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
        highlights: JSON.stringify([
          { title: 'DTCP & RERA Approved', description: '100% legal clarity with clear parent documents and fast bank loan tie-ups.' },
          { title: 'Prime Connectivity', description: 'Just 7 minutes from Tambaram Railway Hub & GST Road.' },
          { title: 'Elevated Land', description: 'Non-flood prone high-elevation land with crystal clear potable water.' },
          { title: 'Ready to Construct', description: 'Surrounded by 500+ occupied independent houses and reputed schools.' },
        ]),
        connectivity: JSON.stringify([
          { title: 'Tambaram Railway Station', distance: '7 Mins' },
          { title: 'Outer Ring Road (ORR)', distance: '3 Mins' },
          { title: 'Chennai International Airport', distance: '22 Mins' },
          { title: 'Delhi Public School & Sri Sairam Group', distance: '5 Mins' },
        ]),
        seo_title: 'Sri Hari Green Enclave - Premium Plots in Tambaram West Chennai',
        seo_description:
          'Buy ready-to-construct CMDA & RERA approved residential plots in Tambaram West, Chennai by Sree Hari Realty Promoters. 24/7 security, 40ft roads, sweet drinking water.',
      },
      {
        name: 'Lotus Gated County',
        slug: 'lotus-gated-county',
        tagline: 'Luxury Gated Villa Plots with Grand Entrance Arch at Guduvanchery',
        description:
          'Lotus Gated County is a landmark 18-acre gated plotted community nestled in the booming corridor of Guduvanchery near SRM University. With 200+ residential plots, dedicated parks, children play zones, and underground utilities, it represents the ideal blend of high-growth investment and serene lifestyle.',
        location: 'Guduvanchery, GST Road, Chennai',
        address: 'Kayarambedu Road, Off GST Road, Guduvanchery, Chennai, Tamil Nadu - 603202',
        city: 'Chennai',
        state: 'Tamil Nadu',
        total_area: '18 Acres',
        total_units: '210 Plots',
        price_range: '₹24 Lakhs - ₹55 Lakhs',
        price_per_sqft: 2600,
        status: 'ONGOING',
        is_featured: true,
        is_visible: true,
        main_image_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
        highlights: JSON.stringify([
          { title: 'Grand Clubhouse Zone', description: 'Designed community space for wellness, walking, and festive gatherings.' },
          { title: 'Close to SRM & Mahindra World City', description: 'High rental and appreciation potential driven by tech workforce.' },
          { title: 'Ready Bank Approvals', description: 'Bank loans approved up to 80% with SBI, HDFC, and LIC HFL.' },
        ]),
        connectivity: JSON.stringify([
          { title: 'Guduvanchery Bus Terminus', distance: '5 Mins' },
          { title: 'SRM University & Hospital', distance: '10 Mins' },
          { title: 'Mahindra World City SEZ', distance: '15 Mins' },
          { title: 'Kilambakkam KCBT Bus Hub', distance: '12 Mins' },
        ]),
        seo_title: 'Lotus Gated County - Gated Community Plots in Guduvanchery Chennai',
        seo_description:
          'Invest in gated community residential plots in Guduvanchery, GST Road. High appreciation plots with 80% bank loans, blacktop roads, and park amenities.',
      },
      {
        name: 'Sri Hari Emerald Meadows',
        slug: 'sri-hari-emerald-meadows',
        tagline: 'Eco-Luxury Nature Plots & Farm Villas at Chengalpattu Highway',
        description:
          'Sri Hari Emerald Meadows offers expansive layout plots from 1200 sqft to 3000 sqft surrounded by lush mango groves and scenic hill views. Perfect for both weekend resort living and long-term capital appreciation.',
        location: 'Chengalpattu, Tamil Nadu',
        address: 'Near Old GST Highway, Chengalpattu, Tamil Nadu - 603001',
        city: 'Chengalpattu',
        state: 'Tamil Nadu',
        total_area: '25 Acres',
        total_units: '180 Plots',
        price_range: '₹18 Lakhs - ₹42 Lakhs',
        price_per_sqft: 1750,
        status: 'UPCOMING',
        is_featured: true,
        is_visible: true,
        main_image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        highlights: JSON.stringify([
          { title: 'Pure Organic Living', description: 'Over 200 fruit-bearing trees and landscaped greenery throughout the layout.' },
          { title: 'Rapid Industrial Growth', description: 'Close to Chengalpattu Medical College and multi-national auto hubs.' },
        ]),
        connectivity: JSON.stringify([
          { title: 'Chengalpattu Junction Railway', distance: '10 Mins' },
          { title: 'National Highway NH 32', distance: '4 Mins' },
          { title: 'Government Hospital & College', distance: '8 Mins' },
        ]),
        seo_title: 'Sri Hari Emerald Meadows - Nature & Farm Villa Plots Chengalpattu',
        seo_description:
          'Discover eco-friendly land & villa plots at Chengalpattu by Sree Hari Realty Promoters. Clean green environment with clear legal titles.',
      },
      {
        name: 'Vedic Temple City Layout',
        slug: 'vedic-temple-city-layout',
        tagline: 'Fully Sold Out Gated Layout Near Thiruporur Murugan Temple',
        description:
          'A flagship landmark project by Sree Hari Realty Promoters completed ahead of schedule, with all 95 plots registered and over 35 villas built by happy owners.',
        location: 'OMR - Thiruporur, Chennai',
        address: 'Near Thiruporur Main Temple, OMR IT Highway, Chennai, Tamil Nadu - 603110',
        city: 'Chennai',
        state: 'Tamil Nadu',
        total_area: '8 Acres',
        total_units: '95 Plots',
        price_range: '₹22 Lakhs - ₹50 Lakhs',
        price_per_sqft: 2200,
        status: 'COMPLETED',
        is_featured: false,
        is_visible: true,
        main_image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        highlights: JSON.stringify([
          { title: '100% Sold Out & Handed Over', description: 'Vibrant living community with families already residing.' },
          { title: 'Clear Legal Pedigree', description: 'DTCP approved layout with complete on-time title handover.' },
        ]),
        connectivity: JSON.stringify([
          { title: 'OMR IT Corridor', distance: '2 Mins' },
          { title: 'Siruseri SIPCOT IT Park', distance: '18 Mins' },
        ]),
        seo_title: 'Vedic Temple City Layout - Completed Plot Project Thiruporur OMR',
        seo_description: 'Completed and delivered gated plot project by Sree Hari Realty Promoters in Thiruporur, OMR.',
      },
    ];

    for (const project of projects) {
      const projRes = await db.query(
        `
        INSERT INTO projects (
          name, slug, tagline, description, location, address, city, state,
          total_area, total_units, price_range, price_per_sqft, status,
          is_featured, is_visible, main_image_url, highlights, connectivity,
          seo_title, seo_description
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          tagline = EXCLUDED.tagline,
          description = EXCLUDED.description,
          location = EXCLUDED.location,
          total_area = EXCLUDED.total_area,
          total_units = EXCLUDED.total_units,
          price_range = EXCLUDED.price_range,
          price_per_sqft = EXCLUDED.price_per_sqft,
          status = EXCLUDED.status,
          is_featured = EXCLUDED.is_featured,
          is_visible = EXCLUDED.is_visible,
          main_image_url = EXCLUDED.main_image_url,
          highlights = EXCLUDED.highlights,
          connectivity = EXCLUDED.connectivity
        RETURNING id;
      `,
        [
          project.name,
          project.slug,
          project.tagline,
          project.description,
          project.location,
          project.address,
          project.city,
          project.state,
          project.total_area,
          project.total_units,
          project.price_range,
          project.price_per_sqft,
          project.status,
          project.is_featured,
          project.is_visible,
          project.main_image_url,
          project.highlights,
          project.connectivity,
          project.seo_title,
          project.seo_description,
        ]
      );

      const projectId = projRes.rows[0].id;

      // Link amenities to this project
      const amenityRows = await db.query(`SELECT id FROM amenities LIMIT 8`);
      for (const aRow of amenityRows.rows) {
        await db.query(
          `INSERT INTO project_amenities (project_id, amenity_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [projectId, aRow.id]
        );
      }

      // Add sample plots / properties
      const plots = [
        {
          title: `Plot 14 - East Facing Villa Plot`,
          slug: `${project.slug}-plot-14`,
          plot_number: '14',
          property_type: 'RESIDENTIAL_PLOT',
          area_sqft: 1200,
          dimensions: '30 x 40 ft',
          facing: 'East',
          price: 3840000,
          price_display: '₹38.40 Lakhs',
          status: 'AVAILABLE',
          is_featured: true,
          is_visible: true,
          description: 'Prime East-facing residential plot located on a 30ft blacktop road right across the landscaped central park.',
        },
        {
          title: `Plot 27 - North Corner Commercial/Residential Plot`,
          slug: `${project.slug}-plot-27`,
          plot_number: '27',
          property_type: 'COMMERCIAL_PLOT',
          area_sqft: 1800,
          dimensions: '36 x 50 ft',
          facing: 'North-East Corner',
          price: 5760000,
          price_display: '₹57.60 Lakhs',
          status: 'AVAILABLE',
          is_featured: false,
          is_visible: true,
          description: 'Prominent corner plot on 40ft double road junction with high visibility and immense appreciation scope.',
        },
        {
          title: `Plot 05 - North Facing Compact Plot`,
          slug: `${project.slug}-plot-05`,
          plot_number: '05',
          property_type: 'RESIDENTIAL_PLOT',
          area_sqft: 900,
          dimensions: '30 x 30 ft',
          facing: 'North',
          price: 2880000,
          price_display: '₹28.80 Lakhs',
          status: 'BOOKED',
          is_featured: false,
          is_visible: true,
          description: 'Ideal compact residential plot for independent single-floor or duplex villa.',
        },
      ];

      for (const plot of plots) {
        await db.query(
          `
          INSERT INTO properties (
            project_id, title, slug, plot_number, property_type, area_sqft,
            dimensions, facing, price, price_display, status, is_featured,
            is_visible, description, main_image_url
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
          ON CONFLICT (slug) DO UPDATE SET
            title = EXCLUDED.title,
            price = EXCLUDED.price,
            price_display = EXCLUDED.price_display,
            status = EXCLUDED.status;
        `,
          [
            projectId,
            plot.title,
            plot.slug,
            plot.plot_number,
            plot.property_type,
            plot.area_sqft,
            plot.dimensions,
            plot.facing,
            plot.price,
            plot.price_display,
            plot.status,
            plot.is_featured,
            plot.is_visible,
            plot.description,
            project.main_image_url,
          ]
        );
      }
    }

    // 4. Seed initial realistic leads
    const sampleLeads = [
      {
        name: 'Karthik Subramanian',
        phone: '9840123456',
        email: 'karthik.subramanian@gmail.com',
        source: 'WEBSITE_FORM',
        message: 'Interested in a 1200 sqft East facing plot at Sri Hari Green Enclave. Looking for immediate registration.',
        status: 'NEW',
      },
      {
        name: 'Suresh Kumar',
        phone: '9884567890',
        email: 'suresh.k@outlook.com',
        source: 'WHATSAPP_CLICK',
        message: 'Please send brochure and price sheet for Lotus Gated County.',
        status: 'CONTACTED',
      },
    ];

    for (const lead of sampleLeads) {
      await db.query(
        `
        INSERT INTO leads (name, phone, email, source, message, status)
        VALUES ($1, $2, $3, $4, $5, $6);
      `,
        [lead.name, lead.phone, lead.email, lead.source, lead.message, lead.status]
      );
    }

    console.log('✅ Development seed completed successfully!');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    throw err;
  }
};

// If run directly via CLI
if (process.argv[1]?.includes('seed')) {
  runSeed()
    .then(() => pool.end())
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
