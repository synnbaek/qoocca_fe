import Loading from '@/components/common/Loading';

export default function LoadingPage() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100%', 
      minHeight: '400px' 
    }}>
      <Loading provider="default" />
    </div>
  );
}