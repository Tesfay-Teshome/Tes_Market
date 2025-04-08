import { ShoppingBag, Shield, Users, TrendingUp } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { useQuery } from '@tanstack/react-query';
import { aboutAPI } from '@/services/api';

interface About {
  id: number;
  title: string;
  description: string;
  content: string;
}

const About = () => {
  const { data: aboutData, error: aboutError, isLoading } = useQuery<About[]>({
    queryKey: ['about'],
    queryFn: async () => {
      const response = await aboutAPI.getAll();
      return Array.isArray(response.data) ? response.data : [];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (aboutError || !aboutData) {
    return (
      <div className="p-4">
        <p className="text-destructive">Failed to load about data</p>
      </div>
    );
  }

  const stats = [
    {
      icon: Users,
      value: '10K+',
      label: 'Active Users',
      color: 'bg-blue-500',
    },
    {
      icon: ShoppingBag,
      value: '50K+',
      label: 'Products',
      color: 'bg-green-500',
    },
    {
      icon: Shield,
      value: '99.9%',
      label: 'Secure Transactions',
      color: 'bg-purple-500',
    },
    {
      icon: TrendingUp,
      value: '24/7',
      label: 'Support',
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FadeIn>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                About Tes Market
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Your trusted marketplace for quality products and reliable vendors
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-6 bg-white rounded-lg shadow">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${stat.color} text-white mb-4`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {aboutData?.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">{item.title}</h2>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="prose prose-gray max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: item.content }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                To create a trusted marketplace that connects quality vendors with buyers,
                ensuring a seamless and secure shopping experience for everyone.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeIn direction="left">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  What Sets Us Apart
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Shield className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" />
                    <p className="text-gray-600">
                      Rigorous vendor verification process to ensure quality
                    </p>
                  </li>
                  <li className="flex items-start">
                    <Users className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" />
                    <p className="text-gray-600">
                      Strong community of buyers and sellers
                    </p>
                  </li>
                  <li className="flex items-start">
                    <TrendingUp className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" />
                    <p className="text-gray-600">
                      Continuous platform improvements based on user feedback
                    </p>
                  </li>
                </ul>
              </div>
            </FadeIn>

            <FadeIn direction="right">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Our Values
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Trust & Security
                    </h4>
                    <p className="text-gray-600">
                      We prioritize the security of transactions and user data
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Quality Assurance
                    </h4>
                    <p className="text-gray-600">
                      We maintain high standards for product quality
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Customer Satisfaction
                    </h4>
                    <p className="text-gray-600">
                      We strive to exceed customer expectations
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;