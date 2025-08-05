import { Component } from '@angular/core';
import { WspacePageHeader } from '../../components/shared/wspace-page-header/wspace-page-header';
import { WspacePageRightSide } from '../../components/shared/wspace-page-right-side/wspace-page-right-side';
import { CardTask } from '../../components/ui/card-task/card-task';

@Component({
  selector: 'app-workspace-project',
  imports: [WspacePageHeader, WspacePageRightSide, CardTask],
  templateUrl: './workspace-project.html',
  styleUrl: './workspace-project.css'
})
export class WorkspaceProject {

}
