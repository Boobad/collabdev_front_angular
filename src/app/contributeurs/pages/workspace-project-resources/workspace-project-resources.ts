import { Component } from '@angular/core';
import { WspacePageRightSide } from "../../components/shared/wspace-page-right-side/wspace-page-right-side";
import { WspacePageHeader } from "../../components/shared/wspace-page-header/wspace-page-header";
import { CardResource } from "../../components/ui/card-resource/card-resource";

@Component({
  selector: 'app-workspace-project-resources',
  imports: [WspacePageRightSide, WspacePageHeader, CardResource],
  templateUrl: './workspace-project-resources.html',
  styleUrl: './workspace-project-resources.css'
})
export class WorkspaceProjectResources {

}
