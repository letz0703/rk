import {Skeleton, SkeletonButton, SkeletonList} from "../components/Skeleton/Skeleton";

export default function LoadingUsersPage(){
	return (<>
	<h1 className="page-title">Users</h1>
	<div className="card-grid">
		<SkeletonList amount={6}>
			<div className="card">
				<div className="card-header">
					<Skeleton short/>
					<Skeleton short/>
					<Skeleton short/>
				</div>
				<div className="card-footer">
					<SkeletonButton/>
				</div>
			</div>
		</SkeletonList>
	</div>
	</>)
}