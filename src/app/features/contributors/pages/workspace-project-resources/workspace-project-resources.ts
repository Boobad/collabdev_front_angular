import { Component } from '@angular/core';
import { CardResource } from "../../../../shared/ui-components/card-resource/card-resource";
import { WspacePageHeader } from "../../../../shared/wspace-page-header/wspace-page-header";
import { WspacePageRightSide } from "../../../../shared/wspace-page-right-side/wspace-page-right-side";


@Component({
  selector: 'app-workspace-project-resources',
  imports: [CardResource, WspacePageHeader, WspacePageRightSide],
  templateUrl: './workspace-project-resources.html',
  styleUrl: './workspace-project-resources.css'
})
export class WorkspaceProjectResources {

}
