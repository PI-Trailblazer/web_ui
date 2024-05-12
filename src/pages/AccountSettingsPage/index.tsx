import { Separator } from '@/components/ui/separator'
import { AccountForm } from './components/AccountForm'
import { Layout, LayoutBody} from '@/components/custom/layout'


export default function AccountSettingsPage() {
  return (
    <Layout>
      <LayoutBody className='space-y-4'>
        <div className='flex items-center justify-between space-y-2'>
            <div className='space-y-1'>
            <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
                Account Settings
            </h1>
            <p className='text-sm text-muted-foreground'>
            Update your account settings. Change your password, email, and other account settings.
            </p>
            </div>
        </div>
        <Separator />
        <div>
        </div>
        <div className='w-full p-1 pr-4 lg:max-w-xl ml-24'>
            <AccountForm />
        </div>
      </LayoutBody>
    </Layout>
  )
}
