// ** Icon imports
import Table from 'mdi-material-ui/Table';
import FormSelect from 'mdi-material-ui/FormSelect';
import HomeOutline from 'mdi-material-ui/HomeOutline';
import AccountOutline from 'mdi-material-ui/AccountOutline';
import ArchiveOutline from 'mdi-material-ui/ArchiveOutline';
import FileDocumentOutline from 'mdi-material-ui/FileDocumentOutline';
import CalendarBlankOutline from 'mdi-material-ui/CalendarBlankOutline';
import { AccountGroupOutline } from 'mdi-material-ui';

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types';

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: '대시보드',
      icon: HomeOutline,
      badgeContent: 'new',
      badgeColor: 'error',
      path: '/dashboards/crm',
    },
    {
      sectionTitle: '서비스 관리',
    },
    {
      title: '회원관리',
      icon: AccountOutline,
    },
    {
      title: '회원사관리',
      icon: AccountGroupOutline,
      children: [
        {
          title: '회원사목록',
          path: '/company/list',
        },
      ],
    },
    {
      title: '수업관리',
      icon: CalendarBlankOutline,
    },
    {
      title: '문제관리',
      icon: Table,
      children: [
        {
          title: '단어 레벨',
        },
        {
          title: '프로젝트',
        },
        {
          title: '전체 단어',
        },
        {
          title: '레벨 카테고리',
        },
        {
          title: '학습 관리',
        },
      ],
    },
    {
      title: '운영관리',
      icon: FileDocumentOutline,
      children: [
        {
          title: '레벨테스트',
        },
        {
          title: '역할',
          path: '/apps/roles',
        },
      ],
    },
    {
      sectionTitle: '게시판',
    },
    {
      title: '공지사항',
      icon: FormSelect,
      children: [
        {
          title: '본사용',
          path: '/notice/list',
        },
      ],
    },
    {
      title: '고객센터',
      icon: ArchiveOutline,
      children: [
        {
          title: '자주 묻는 질문',
          path: '/faq/list',
        },
        {
          title: '나의 1:1 문의',
        },
        {
          title: '문의내역 관리',
        },
      ],
    },
  ];
};

export default navigation;
